import { Elysia } from "elysia";
import { taskRoute } from "./tasks";
import { authRoute } from "./auth";

export const app = new Elysia()
  .use(taskRoute)
  .use(authRoute);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
