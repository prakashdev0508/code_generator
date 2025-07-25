import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/server/procedure";
import { projectRouter } from "@/modules/project/server/procedure";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
