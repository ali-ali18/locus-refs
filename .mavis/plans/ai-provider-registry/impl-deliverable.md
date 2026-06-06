# Deliverable — AI Provider Registry (impl)

## Summary
Introduced a declarative `ProviderDefinition` abstraction, added a central `providerRegistry`, and migrated the existing `anthropic` and `minimax` providers to the new schema-driven format. The public surface of `apps/web/src/lib/ai/models.ts` (`AI_MODELS`, `getModel`, `getAvailableModels`, `DEFAULT_MODEL_ID`, `AiProvider`, `AiModelDefinition`) is byte-compatible with the previous API — no other file in the repo was modified.

## Commit
- Branch: `wt/5d6a56e6`
- Hash: `bc7302d397d3d5e5dde0f9bf83e59ec8a4bf8a24` (short: `bc7302d`)
- Message: `refactor(ai): introduce ProviderDefinition registry and migrate anthropic/minimax providers`
- NOT pushed (per instructions).

## Changed files

### Created
- `C:\Dev\Personal\locus-refs\.worktrees\wt-5d6a56e6\apps\web\src\lib\ai\providers\types.ts`
- `C:\Dev\Personal\locus-refs\.worktrees\wt-5d6a56e6\apps\web\src\lib\ai\providers\registry.ts`

### Modified
- `C:\Dev\Personal\locus-refs\.worktrees\wt-5d6a56e6\apps\web\src\lib\ai\providers\anthropic.ts`
- `C:\Dev\Personal\locus-refs\.worktrees\wt-5d6a56e6\apps\web\src\lib\ai\providers\minimax.ts`
- `C:\Dev\Personal\locus-refs\.worktrees\wt-5d6a56e6\apps\web\src\lib\ai\models.ts`

`git status -- apps/web/src/lib/ai/` and `git show --stat HEAD` confirm zero changes outside `apps/web/src/lib/ai/`.

## Validation results

| # | Command | Result |
|---|---------|--------|
| 1 | `pnpm exec tsc --noEmit -p apps/web/tsconfig.json` | **0 errors** (clean exit) |
| 2 | `pnpm exec biome check apps/web/src/lib/ai/` | **0 errors** ("Checked 13 files. No fixes applied.") |
| 3 | `pnpm lint` (full repo) | **131 errors** — all pre-existing in `prisma.config.mjs`, `apps/web/src/app/globals.css`, and import-order suggestions in `apps/web/src/app/api/ai/chat/route.ts`. None in `apps/web/src/lib/ai/`. Confirmed by stashing the commit and re-running: identical 131 errors on baseline. |
| 4 | `pnpm test:run` | **53 passed, 3 failed** — the 3 failures are pre-existing in `src/app/api/collection/routes.test.ts` and `src/app/api/notes/route.test.ts` (collection/notes create flows), completely unrelated to the AI subsystem. Confirmed by stashing the commit: identical 3 failures on baseline. |
| 5 | `git status -- apps/web/src/lib/ai/` | Only the 5 AI files listed (3 modified, 2 new). No other working-tree changes. |

## Design decisions

### 1. Public `ProviderDefinition` is **not** generic
Per the plan owner's steering ("achatar o tipo no boundary do registry — defaultConfig/isConfigured/buildModel/listModels passam a aceitar `Record<string, unknown>` na interface publica"), the public interface uses the wide `Record<string, unknown>` for the config parameter. Each concrete provider (`anthropicProvider`, `minimaxProvider`) calls its own zod schema internally:
- `isConfigured` does `configSchema.safeParse(config)` and checks the parsed `apiKey`.
- `buildModel` does `configSchema.parse(config)` and uses the typed result for the SDK call.

This eliminates the generic-variance gymnastics I had on my first pass (the `as const` tuple + `as ProviderDefinition` casts in `getProvider`, and the conditional `as` cast on the config merge in `resolveModel`). The registry iterates over a uniform `readonly ProviderDefinition[]`; iteration is type-clean. Type safety is recovered inside each implementation via `configSchema.parse(config)`.

The `C extends ProviderConfigSchema` generic was removed from the public interface — keeping it would have re-introduced the union variance the steering aimed to fix. `ProviderConfigSchema = z.ZodTypeAny` is still exported for future use.

### 2. `claude-haiku-4-5` → `claude-haiku-4-5-20251001` mapping
The public `id` stays `claude-haiku-4-5` (preserves the value stored in `WorkspaceAiSettings.defaultModelId` and matched by `getModel("claude-haiku-4-5")` in `classify-intent.ts`). The actual SDK model id `claude-haiku-4-5-20251001` lives in a new optional `modelId?: string` field on `ModelMetadata`. In `models.ts#flattenRegistry`, the `build` closure uses `model.modelId ?? model.id`, so the registry has a single source of truth and the consumer never has to know about the SDK id.

The same pattern is used for the `minimax` static models (`minimax-m2.7` → `MiniMax-M2.7`, `minimax-m2.7-highspeed` → `MiniMax-M2.7-highspeed`) — that mapping was already there in the old `AI_MODELS`, I just preserved it.

### 3. `AiProvider = string` (not literal union)
The prompt explicitly allowed this. `export type AiProvider = ProviderDefinition["id"]` resolves to `string` now that `ProviderDefinition` is not generic. This keeps `AiModelDefinition.provider` assignable from any future `ProviderDefinition.id` without further changes — adding a new provider is a one-line change to the registry.

### 4. `isAvailable` re-evaluates the default config on each call
In the prompt's reference `flattenRegistry`, the default config was captured once at module init: `const config = provider.defaultConfig(); ... isAvailable: () => provider.isConfigured(config)`. I chose to re-call `provider.defaultConfig()` on each `isAvailable()` invocation, which matches the original behaviour (`isAvailable: () => !!process.env.ANTHROPIC_API_KEY` was re-evaluated on each call in the old code). The cost is negligible (a couple of `process.env` lookups), and it makes the model more honest about live environment state if env ever changes at runtime.

### 5. `Icon` field left empty
The `icon?: string` slot is part of the new `ProviderDefinition` interface but neither provider fills it yet — no icons are referenced in the existing UI (it just renders the label). I left the field in place so a future UI pass can add icons without a schema change.

### 6. `metadata?: ModelMetadata` on `AiModelDefinition`
The prompt asked for this. The flatten pass sets it from the registry entry, so downstream code (UI in `WorkspaceAiConfig`, future model-detail dialog) can read capabilities, context window, cost, modalities without going back to the registry.

### 7. Static models: cost values
Used the values the prompt suggested (`0.003/0.015` for Sonnet 4.6, `0.0008/0.004` for Haiku 4.5) verbatim. The current Anthropic public pricing for Haiku 4.5 is closer to `$1/$5 per MTok` (i.e. `0.001/0.005`) and Sonnet 4.5 lists at `$3/$15 per MTok` (matching `0.003/0.015`). The Haiku value is slightly off vs. the public site; flagged here in case the team wants to align it.

### 8. `listModels` is declared on the interface but no provider implements it
The interface field is `listModels?: ...` (optional). Neither provider overrides it because both rely on the `staticModels` constant. The field is reserved for future providers (e.g. OpenAI) that need an API call to enumerate models.

## Divergences from the original prompt
- **`ProviderDefinition<C>` is no longer generic.** Per plan-owner steering, methods take `Record<string, unknown>`. The zod schemas still exist per provider; they are used internally for validation/typing at call time.
- **`as const satisfies readonly ProviderDefinition[]` on `providerRegistry` was removed.** With the public interface non-generic, a plain `readonly ProviderDefinition[]` annotation is sufficient and the `as const` machinery is no longer needed.
- **`ProviderId` type was removed from the registry export.** The prompt showed `export type ProviderId = (typeof providerRegistry)[number]["id"]`. With the non-generic registry, that resolves to `string` (identical to `ProviderDefinition["id"]`), so the export is redundant — callers can import `ProviderDefinition["id"]` or just use `AiProvider` from `models.ts`.
- **`InferProviderConfig` was removed** from `types.ts`. The prompt said "só se fizer sentido — mantenha enxuto". Without the generic on `ProviderDefinition`, the type has no anchor and would just resolve to `z.infer<z.ZodTypeAny>` = `any`. Not worth exporting.
- **No `Readonly` explicit on `models.ts` returned arrays** beyond what was already there. The `readonly AiModelDefinition[]` typing on `AI_MODELS` was preserved; `getAvailableModels` already returned a `readonly` view in the original code.

## Consumer contract
All five consumer files were **not modified** (byte-for-byte preserved), as required:
- `apps/web/src/app/api/ai/chat/route.ts` — still calls `getModel(modelId).build()`.
- `apps/web/src/app/api/ai/models/route.ts` — still calls `getAvailableModels().map(({id, provider, label, description}) => …)`.
- `apps/web/src/lib/ai/classify-intent.ts` — still calls `getModel("claude-haiku-4-5").build()`.
- `apps/web/src/lib/ai/tools.ts`, `prompts.ts`, `intent.ts` — unchanged.
- `apps/web/src/components/workspace/config/WorkspaceAiConfig.tsx` and `apps/web/src/app/[workspaceSlug]/settings/ai/page.tsx` — unchanged (the new `metadata` field is additive and the new `AiModelDefinition` shape is a superset of the old one).

The `AiModelDefinition` interface gained one field (`metadata?: ModelMetadata`); no existing field was renamed or removed. `provider` widened from `"anthropic" | "minimax"` to `string` — this is a type-narrowing loss for type-level safety but the prompt explicitly allows it and no consumer relies on the literal union.

## Next steps for follow-up
- Add `minimax-m2.7` / `minimax-m2.7-highspeed` cost fields once MiniMax publishes pricing.
- Add a third provider (OpenAI is the obvious candidate — `@ai-sdk/openai` is already a dependency) to validate the new registry.
- Surface `metadata.contextWindow` and `metadata.costPer1kInput/Output` in the workspace settings UI.
