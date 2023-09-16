import Elysia from "elysia";
import { TaskRepository } from "./tasks/task.repository";
import { AuthRepository } from "./auth/auth.repository";

export const setup = new Elysia({ name: "setup" })
  .decorate({
    taskRepository: TaskRepository,
  })
  .decorate({
    authRepository: AuthRepository,
  })