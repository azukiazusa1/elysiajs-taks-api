import { Elysia, t } from "elysia";
import { Static } from "@sinclair/typebox";

const status = t.Union([t.Literal("done"), t.Literal("pending"), t.Literal("in-progress")])

const task = t.Object({
  id: t.String(),
  name: t.String(),
  status,
})

export type Task = Static<typeof task>

const taskDto = t.Object({
  name: t.String(),
  status,
})

export type TaskDto = Static<typeof taskDto>

const app = new Elysia();
export const taskModel = app.model({
  "task.task": t.Object({
    task,
  }),
  "task.tasks": t.Object({
    tasks: t.Array(task),
  }),
  "task.taskDto": taskDto,
})