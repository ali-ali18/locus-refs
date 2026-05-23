function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

type RoadmapItemInput = {
  id?: string;
  name?: string;
  startAt?: string;
  endAt?: string;
  statusId?: string;
  column?: string;
  createdBy?: {
    name?: string;
    image?: string;
  };
};

type RoadmapStatusInput = {
  id?: string;
  name?: string;
  color?: string;
};

const DEFAULT_ROADMAP_STATUSES: RoadmapStatusInput[] = [
  { id: "todo", name: "A fazer", color: "#94a3b8" },
  { id: "in-progress", name: "Em andamento", color: "#3b82f6" },
  { id: "done", name: "Concluido", color: "#22c55e" },
];

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();

  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:"
    ) {
      return trimmed;
    }
  } catch {}

  return null;
}

function restorePlaceholders(text: string, placeholders: string[]): string {
  return text.replace(
    /@@HTML_(\d+)@@/g,
    (_, index) => placeholders[Number(index)] ?? "",
  );
}

function formatInlineMarkdown(input: string, allowLinks = true): string {
  const placeholders: string[] = [];
  const stash = (html: string) => {
    const index = placeholders.push(html) - 1;
    return `@@HTML_${index}@@`;
  };

  let text = input;

  text = text.replace(/`([^`]+)`/g, (_, code: string) =>
    stash(
      `<code class="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.92em]">${escapeHtml(code)}</code>`,
    ),
  );

  if (allowLinks) {
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label: string, url: string) => {
        const sanitizedUrl = sanitizeUrl(url);
        if (!sanitizedUrl) {
          return escapeHtml(label);
        }

        return stash(
          `<a href="${escapeAttribute(sanitizedUrl)}" target="_blank" rel="noreferrer" class="underline underline-offset-2">${formatInlineMarkdown(label, false)}</a>`,
        );
      },
    );
  }

  text = escapeHtml(text);
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  text = text.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>");

  return restorePlaceholders(text, placeholders);
}

function isBlank(line: string): boolean {
  return line.trim().length === 0;
}

function isUnorderedListItem(line: string): boolean {
  return /^[-*+]\s+/.test(line.trim());
}

function isOrderedListItem(line: string): boolean {
  return /^\d+[.)]\s+/.test(line.trim());
}

function isTaskListItem(line: string): boolean {
  return /^[-*+]\s+\[( |x|X)\]\s+/.test(line.trim());
}

function isSpecialBlock(line: string): boolean {
  const trimmed = line.trim();

  return (
    trimmed.startsWith("```") ||
    /^#{1,3}\s+/.test(trimmed) ||
    trimmed.startsWith(">") ||
    isTaskListItem(trimmed) ||
    isUnorderedListItem(trimmed) ||
    isOrderedListItem(trimmed)
  );
}

function renderParagraph(lines: string[]): string {
  const html = lines
    .map((line) => formatInlineMarkdown(line.trim()))
    .join("<br />");
  return `<p>${html}</p>`;
}

function renderList(items: string[], kind: "ul" | "ol"): string {
  const children = items
    .map((item) => `<li>${formatInlineMarkdown(item)}</li>`)
    .join("");

  return `<${kind}>${children}</${kind}>`;
}

function renderTaskList(lines: string[]): string {
  const items = lines
    .map((line) => {
      const match = line.trim().match(/^[-*+]\s+\[( |x|X)\]\s+(.+)$/);
      if (!match) return "";

      const checked = match[1].toLowerCase() === "x";
      const text = formatInlineMarkdown(match[2]);

      return `<li data-type="taskItem" data-checked="${checked}"><p>${text}</p></li>`;
    })
    .join("");

  return `<ul data-type="taskList">${items}</ul>`;
}

function normalizeRoadmapBlock(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw) as {
      items?: RoadmapItemInput[];
      statuses?: RoadmapStatusInput[];
    };

    const statuses =
      parsed.statuses
        ?.map((status, index) => {
          if (!status?.name?.trim()) return null;

          return {
            id: status.id?.trim() || `status-${index + 1}`,
            name: status.name.trim(),
            color:
              status.color?.trim() ||
              DEFAULT_ROADMAP_STATUSES[index]?.color ||
              "#94a3b8",
          };
        })
        .filter(
          (status): status is NonNullable<typeof status> => status !== null,
        ) ?? DEFAULT_ROADMAP_STATUSES;

    const defaultStatusId = statuses[0]?.id ?? "todo";

    const items =
      parsed.items
        ?.map((item, index) => {
          if (
            !item?.name?.trim() ||
            !item.startAt?.trim() ||
            !item.endAt?.trim()
          ) {
            return null;
          }

          const statusId = item.statusId?.trim() || defaultStatusId;

          return {
            id: item.id?.trim() || `roadmap-item-${index + 1}`,
            name: item.name.trim(),
            startAt: item.startAt.trim(),
            endAt: item.endAt.trim(),
            statusId,
            column: item.column?.trim() || statusId,
            createdBy: {
              name: item.createdBy?.name?.trim() || "AI",
              ...(item.createdBy?.image?.trim()
                ? { image: item.createdBy.image.trim() }
                : {}),
            },
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null) ??
      [];

    const statusMap = new Map(statuses.map((s) => [s.id, s]));
    const itemsHtml = items
      .map((item) => {
        const status = statusMap.get(item.statusId);
        const statusName = escapeHtml(status?.name ?? item.statusId);
        return `<li><strong>${escapeHtml(item.name)}</strong> — ${escapeHtml(item.startAt)} → ${escapeHtml(item.endAt)} <em>(${statusName})</em></li>`;
      })
      .join("");

    const preview =
      items.length > 0
        ? `<ul>${itemsHtml}</ul>`
        : "<p><em>Roadmap vazio</em></p>";

    return `<div data-type="roadmapBlock" data-items="${escapeAttribute(JSON.stringify(items))}" data-statuses="${escapeAttribute(JSON.stringify(statuses))}">${preview}</div>`;
  } catch {
    return null;
  }
}

export function markdownToHtml(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();

  if (!normalized) return "<p></p>";

  const lines = normalized.split("\n");
  const blocks: string[] = [];

  for (let index = 0; index < lines.length; ) {
    const current = lines[index];
    const trimmed = current.trim();

    if (isBlank(current)) {
      index += 1;
      continue;
    }

    const codeFenceMatch = trimmed.match(/^```([\w-]+)?\s*$/);
    if (codeFenceMatch) {
      const language = codeFenceMatch[1];
      const buffer: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        buffer.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      if (language === "roadmap") {
        const roadmapBlock = normalizeRoadmapBlock(buffer.join("\n"));
        if (roadmapBlock) {
          blocks.push(roadmapBlock);
          continue;
        }
      }

      const languageClass = language
        ? ` class="language-${escapeAttribute(language)}"`
        : "";
      blocks.push(
        `<pre><code${languageClass}>${escapeHtml(buffer.join("\n"))}</code></pre>`,
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(
        `<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`,
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const buffer: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith(">")) {
        buffer.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }

      blocks.push(
        `<blockquote>${markdownToHtml(buffer.join("\n"))}</blockquote>`,
      );
      continue;
    }

    if (isTaskListItem(trimmed)) {
      const buffer: string[] = [];

      while (index < lines.length && isTaskListItem(lines[index].trim())) {
        buffer.push(lines[index]);
        index += 1;
      }

      blocks.push(renderTaskList(buffer));
      continue;
    }

    if (isUnorderedListItem(trimmed)) {
      const buffer: string[] = [];

      while (index < lines.length && isUnorderedListItem(lines[index].trim())) {
        buffer.push(lines[index].trim().replace(/^[-*+]\s+/, ""));
        index += 1;
      }

      blocks.push(renderList(buffer, "ul"));
      continue;
    }

    if (isOrderedListItem(trimmed)) {
      const buffer: string[] = [];

      while (index < lines.length && isOrderedListItem(lines[index].trim())) {
        buffer.push(lines[index].trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }

      blocks.push(renderList(buffer, "ol"));
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      !isBlank(lines[index]) &&
      !isSpecialBlock(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push(renderParagraph(paragraphLines));
      continue;
    }

    index += 1;
  }

  return blocks.join("");
}
