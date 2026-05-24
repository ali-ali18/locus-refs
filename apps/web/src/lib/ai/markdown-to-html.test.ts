import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./markdown-to-html";

describe("markdownToHtml", () => {
  it("renderiza paragrafos e inline marks", () => {
    expect(markdownToHtml("Texto com **forte** e *italico*.")).toBe(
      "<p>Texto com <strong>forte</strong> e <em>italico</em>.</p>",
    );
  });

  it("renderiza listas, heading e code block", () => {
    expect(
      markdownToHtml(
        "# Titulo\n\n- item 1\n- item 2\n\n```ts\nconst x = 1;\n```",
      ),
    ).toBe(
      '<h1>Titulo</h1><ul><li>item 1</li><li>item 2</li></ul><pre><code class="language-ts">const x = 1;</code></pre>',
    );
  });

  it("escapa html cru e preserva links validos", () => {
    expect(
      markdownToHtml("<script>alert(1)</script> [site](https://example.com)"),
    ).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt; <a href="https://example.com" target="_blank" rel="noreferrer" class="underline underline-offset-2">site</a></p>',
    );
  });

  it("converte fenced block roadmap em roadmapBlock customizado", () => {
    expect(
      markdownToHtml(`\`\`\`roadmap
{
  "items": [
    {
      "name": "Planejamento",
      "startAt": "2026-06-01",
      "endAt": "2026-06-07",
      "statusId": "todo"
    }
  ]
}
\`\`\``),
    ).toBe(
      '<div data-type="roadmapBlock" data-items="[{&quot;id&quot;:&quot;roadmap-item-1&quot;,&quot;name&quot;:&quot;Planejamento&quot;,&quot;startAt&quot;:&quot;2026-06-01&quot;,&quot;endAt&quot;:&quot;2026-06-07&quot;,&quot;statusId&quot;:&quot;todo&quot;,&quot;column&quot;:&quot;todo&quot;,&quot;createdBy&quot;:{&quot;name&quot;:&quot;AI&quot;}}]" data-statuses="[{&quot;id&quot;:&quot;todo&quot;,&quot;name&quot;:&quot;A fazer&quot;,&quot;color&quot;:&quot;#94a3b8&quot;},{&quot;id&quot;:&quot;in-progress&quot;,&quot;name&quot;:&quot;Em andamento&quot;,&quot;color&quot;:&quot;#3b82f6&quot;},{&quot;id&quot;:&quot;done&quot;,&quot;name&quot;:&quot;Concluido&quot;,&quot;color&quot;:&quot;#22c55e&quot;}]"><ul><li><strong>Planejamento</strong> — 2026-06-01 → 2026-06-07 <em>(A fazer)</em></li></ul></div>',
    );
  });
});
