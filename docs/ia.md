# Assistente de IA — Arquitetura e Funcionamento

## Visão geral

O Refstash possui um assistente de IA integrado ao editor de notas. Ele entende o conteúdo da nota que você está editando e responde em tempo real via streaming, sem precisar copiar e colar nada.

---

## Como o editor salva o conteúdo

O editor é construído em cima do [Tiptap](https://tiptap.dev), um editor de texto rico baseado em ProseMirror. O conteúdo de cada nota é armazenado no banco de dados como **JSON estruturado** (formato nativo do Tiptap), não como HTML.

### Por que JSON e não HTML?

| HTML | JSON (Tiptap) |
|------|---------------|
| String de texto com tags mescladas | Árvore de nós tipados e semânticos |
| Difícil de analisar por IA | Lido diretamente pela IA como estrutura |
| Inserir conteúdo de volta exige parse | `editor.commands.insertContent(json)` nativo |
| Perda de semântica em nós customizados | Todos os atributos preservados |

### Estrutura do JSON

Cada nota é um documento Tiptap, que segue o formato:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Minha nota" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Conteúdo aqui..." }]
    }
  ]
}
```

Os tipos de nó suportados incluem: `paragraph`, `heading` (h1–h3), `bulletList`, `orderedList`, `taskList`, `taskItem`, `blockquote`, `codeBlock`, `image`, `roadmapBlock`, e mais.

---

## Como o JSON vira texto para a IA

A IA não recebe o JSON bruto. Um conversor interno (`apps/web/src/lib/ai/note-to-text.ts`) percorre a árvore de nós e extrai o texto puro, seguindo a semântica de cada nó:

```
# Minha nota

Conteúdo aqui...

[ ] Tarefa pendente
[x] Tarefa concluída

```texto
const exemplo = "code block"
```

[roadmap block]
```

Isso garante que a IA receba o contexto da nota de forma limpa, sem ruído de classes CSS ou atributos de layout.

---

## Como o HTML é gerado quando necessário

Para casos como exportações, emails ou previews estáticas, o JSON pode ser convertido de volta para HTML de forma fiel usando `apps/web/src/lib/notes-html.ts`:

```ts
import { noteJsonToHtml } from "@/lib/notes-html";

const html = noteJsonToHtml(note.content);
```

A conversão usa as **mesmas extensões** do editor, garantindo que nós customizados (como `RoadmapBlock` e `ImageUpload`) sejam renderizados corretamente.

---

## Modelos disponíveis

Os modelos de IA estão registrados em `apps/web/src/lib/ai/models.ts`. Cada modelo possui:

| Campo | Descrição |
|-------|-----------|
| `id` | Identificador único estável (ex: `claude-sonnet-4-6`) |
| `provider` | Provedor (ex: `anthropic`) |
| `label` | Nome exibido na interface |
| `description` | Descrição curta do modelo |
| `build()` | Função que instancia o cliente do modelo |

### Modelos ativos

| ID | Nome | Uso ideal |
|----|------|-----------|
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | Uso geral — equilíbrio entre qualidade e velocidade |
| `claude-haiku-4-5` | Claude Haiku 4.5 | Tarefas rápidas e simples |

Para adicionar um novo modelo, basta adicionar uma entrada no array `AI_MODELS` em `apps/web/src/lib/ai/models.ts`.

---

## Preferências por workspace

Cada workspace pode escolher seu modelo padrão. Essa preferência é salva na tabela `WorkspaceAiSettings` (1:1 com `Organization`) e pode ser alterada via:

- **API**: `PATCH /api/ai/settings` com `{ defaultModelId: "claude-sonnet-4-6" }`
- **Hook**: `useUpdateAiSettings()` de `apps/web/src/hook/ai/useAiSettings.ts`

Também é possível definir um **system prompt customizado** por workspace via o campo `systemPrompt`.

---

## Rotas da API

### `GET /api/ai/models`
Lista os modelos disponíveis (sem expor chaves ou configurações internas).

```json
{
  "models": [
    {
      "id": "claude-sonnet-4-6",
      "provider": "anthropic",
      "label": "Claude Sonnet 4.6",
      "description": "Equilíbrio entre velocidade e qualidade — recomendado"
    }
  ]
}
```

---

### `GET /api/ai/settings`
Retorna as configurações de IA do workspace atual. Cria com valores padrão se ainda não existir.

```json
{
  "settings": {
    "workspaceId": "...",
    "defaultModelId": "claude-sonnet-4-6",
    "systemPrompt": null
  }
}
```

---

### `PATCH /api/ai/settings`
Atualiza o modelo padrão e/ou o system prompt do workspace.

```json
{ "defaultModelId": "claude-haiku-4-5" }
```

---

### `POST /api/ai/chat`
Envia uma mensagem para o assistente. Retorna a resposta em **streaming** (Server-Sent Events).

**Corpo da requisição:**

```json
{
  "noteId": "uuid-da-nota",
  "messages": [
    { "role": "user", "content": "Resuma esta nota em 3 pontos" }
  ],
  "modelId": "claude-sonnet-4-6"
}
```

- `noteId` é opcional. Quando informado, o conteúdo da nota é injetado automaticamente no contexto.
- `modelId` é opcional. Quando omitido, usa o modelo padrão do workspace.
- A resposta é um stream de texto (`text/plain; charset=utf-8`).

**Cadeia de contexto montada para a IA:**

```
[system prompt do workspace ou padrão]

## Nota atual: "Título da nota"

[texto extraído do JSON da nota]

[mensagens do usuário]
```

---

## Fluxo completo

```
Usuário digita no editor
  → onChange → editor.getJSON()
    → useNoteContentStatus (debounce 500ms)
      → PATCH /api/notes/:id { content: JSONContent }
        → Prisma salva em Note.content (Json no PostgreSQL)

Usuário abre o assistente
  → POST /api/ai/chat { noteId, messages }
    → Carrega note.content do banco
    → noteJsonToText(content) → texto plano
    → streamText({ model, system + contexto, messages })
      → stream SSE para o cliente
```

---

## Plano futuro — Chaves próprias por workspace (BYOK)

Atualmente, todos os workspaces compartilham a chave `ANTHROPIC_API_KEY` configurada no servidor. O plano futuro permite que cada workspace cadastre suas próprias chaves de API para qualquer provedor compatível, incluindo:

- **Google Gemini** (`@ai-sdk/google`)
- **MinMax** (OpenAI-compatible, base URL customizada)
- **OpenAI** (`@ai-sdk/openai`)
- **Groq** (latência ultra-baixa)

As chaves serão criptografadas com AES-256-GCM antes de salvar no banco e nunca retornadas nas APIs. Detalhes completos estão no arquivo de plano em `docs/ia-byok-plano.md`.
