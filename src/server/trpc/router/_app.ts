import { router } from "../trpc";
import { authRouter } from "./auth";
import { openaiRouter } from "./openai";
import { awsRouter } from "./aws";

export const appRouter = router({
  example: openaiRouter,
  auth: authRouter,
  aws: awsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
