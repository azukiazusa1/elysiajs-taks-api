import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { setup } from "../setup";
export const isAuthenticated = new Elysia()
  .use(setup)
  .use(cookie())
  .use(jwt({
    secret: "super-secret-key",
  }))
  .derive(async ({ cookie, jwt, authRepository }) => {
    // Cookie が存在するか
    if (!cookie?.token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    // JWT トークンを検証
    const token = await jwt.verify(cookie.token);
    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // ユーザーが存在するか
    const user = authRepository.getUserById(token.id);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // すべての検証をパスしたならば、ユーザー
    return {
      success: true,
      message: "Authorized",
      user,
    };
  });