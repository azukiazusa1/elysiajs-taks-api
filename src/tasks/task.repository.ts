import { Database } from "bun:sqlite";
import { Task, TaskDto } from "./task.model";

const db = new Database("db.sqlite");

const getAllQuery = db.prepare("SELECT id, name, status FROM tasks WHERE user_id = ?");
const getTaskByIdQuery = db.prepare("SELECT id, name, status FROM tasks WHERE id = ?");
const insertQuery = db.prepare("INSERT INTO tasks (id, name, status, user_id) VALUES (?, ?, ?, ?)");

export const TaskRepository = {
  /**
   * すべてのタスクを取得する
   */
  getAll(userId: string) {
    return getAllQuery.all(userId) as Task[];
  },

  /**
   * タスクを作成する
   */
  create(taskDto: TaskDto, userId: string) {
    const id = crypto.randomUUID();
    insertQuery.run(id, taskDto.name, taskDto.status, userId);
    const record = getTaskByIdQuery.get(id);

    if (!record) {
      throw new Error("Task not found");
    }

    return record as Task;
  }
}
