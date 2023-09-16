import { Database } from "bun:sqlite";
import { User, UserDto } from "./auth.model";

const db = new Database("db.sqlite");

const getUserByIdQuery = db.prepare("SELECT * FROM users WHERE id = ?");
const getUserByUsernameQuery = db.prepare("SELECT * FROM users WHERE username = ?");
const insertQuery = db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)");

type Result = {
  success: true,
  user: User,
} | {
  success: false,
  message: string,
}

export const AuthRepository = {
  /**
   * ユーザーを登録する
   */
  async create(userDto: UserDto): Promise<Result> {
    const existingUser = getUserByUsernameQuery.get(userDto.username);
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      }
    }
    const id = crypto.randomUUID();
    const hashedPassword = await Bun.password.hash(userDto.password);
    insertQuery.run(id, userDto.username, hashedPassword);
    const record = getUserByIdQuery.get(id);

    if (!record) {
      return {
        success: false,
        message: "Unable to create user"
      }
    }

    return {
      success: true,
      user: record as User,
    }
  },

  /**
   * ユーザーログイン
   */
  async login(userDto: UserDto): Promise<Result> {
    const record = getUserByUsernameQuery.get(userDto.username) as User | null;

    if (!record) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const isValid = await Bun.password.verify(userDto.password, record.password);

    if (!isValid) {
      return {
        success: false,
        message: "User not found",
      }
    }

    return {
      success: true,
      user: record,
    }
  },

  /**
   * ユーザーを取得する
   */
  getUserById(id: string): User | null {
    const record = getUserByIdQuery.get(id);

    return record as User | null;
  }
}