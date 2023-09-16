import { Elysia, t } from "elysia";
import { authModel } from "./auth.model";
import { setup } from "../setup";
import { jwt } from '@elysiajs/jwt'
import cookie from "@elysiajs/cookie";

export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
  .use(jwt({
    secret: "super-secret-key",
  }))
  .use(cookie())
  .post("/auth/signup", async ({ body, authRepository, set }) => {
    const result = await authRepository.create(body);

    if (result.success === false) {
      set.status = 400;
      return {
        message: result.message,
      }
    }

    set.status = 201;
    return {
      message: "User created successfully",
    };
  }, {
    body: "auth.userDto",
  })
  .post("/auth/signin", async ({ jwt, body, authRepository, set, setCookie }) => {
    const result = await authRepository.login(body);

    if (result.success === false) {
      set.status = 400;
      return {
        message: result.message,
      }
    }

    const token = await jwt.sign({
      id: result.user.id,
      username: result.user.username,
    });

    setCookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return {
      message: "User logged in successfully",
    };
  }, {
    body: "auth.userDto",
    response: t.Object({
      message: t.String(),
    }),
  });