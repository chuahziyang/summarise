import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { awsRouter } from "./aws";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  aws: awsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
