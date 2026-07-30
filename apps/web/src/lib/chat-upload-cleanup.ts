import { api } from "@/lib/api";

/** Apaga anexos em `{workspaceId}/chat/` que nao chegaram a ser usados na mensagem. */
export async function deleteChatUploads(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.filter((u) => u.startsWith("/storage/")))];
  if (unique.length === 0) return;

  try {
    await api.delete("/api/upload/chat", { data: { urls: unique } });
  } catch {
    // Melhor esforço — cron de 6 meses limpa residual
  }
}
