import { Elysia } from "elysia";
import { taskModel } from "./task.model";
import { setup } from "../setup";
import { isAuthenticated } from "../auth/isAuthenticated";

export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
  .use(isAuthenticated)
  .guard({
    beforeHandle: [({ user, set }) => {
      if (!user) {
        set.status = 401;
        return {
          message: "Unauthorized",
        }
      }
    }]
  })
  .get("/tasks", ({ taskRepository, user }) => {
    const tasks = taskRepository.getAll(user!.id);
    return {
      tasks,
    };
    }, {
      response: "task.tasks",
    }
  )
  .post("/tasks", ({ body, taskRepository, user }) => {
    const newTask = taskRepository.create(body, user!.id);

    return {
      task: newTask,
    };
  }, {
      body: "task.taskDto",
      response: "task.task",
    }
  );
