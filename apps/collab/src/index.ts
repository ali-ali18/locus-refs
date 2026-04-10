import "dotenv/config";
import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

const COLLAB_JWT_SECRET = process.env.COLLAB_JWT_SECRET;
if (!COLLAB_JWT_SECRET) {
  throw new Error("COLLAB_JWT_SECRET is not set");
}

interface CollabContext {
  userId: string;
  workspaceId: string;
  noteId: string;
}

const server = new Server({
  port: parseInt(process.env.PORT ?? "1234", 10),
  debounce: 2000,
  maxDebounce: 10000,
  quiet: false,

  async onAuthenticate(data) {
    const { token, documentName } = data;

    let payload: CollabContext;
    try {
      payload = jwt.verify(token, COLLAB_JWT_SECRET) as CollabContext;
    } catch {
      throw new Error("Unauthorized");
    }

    if (payload.noteId !== documentName) {
      throw new Error("Forbidden");
    }

    return payload;
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const note = await prisma.note.findUnique({
          where: { id: documentName },
          select: { ydoc: true },
        });
        return note?.ydoc ?? null;
      },
      store: async ({ documentName, state }) => {
        await prisma.note.update({
          where: { id: documentName },
          data: { ydoc: Buffer.from(state) },
        });
      },
    }),
  ],
});

server.listen();
