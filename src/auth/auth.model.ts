import { Elysia, t } from "elysia";
import { Static } from "@sinclair/typebox";

const user = t.Object({
  id: t.String(),
  username: t.String(),
  password: t.String(),
})

export type User = Static<typeof user>

const userDto = t.Object({
  username: t.String(),
  password: t.String(),
})

export type UserDto = Static<typeof userDto>

const app = new Elysia();
export const authModel = app.model({
  "auth.user": user,
  "auth.userDto": userDto,
})