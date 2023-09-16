import { afterAll, beforeAll, describe, it, expect } from "bun:test";
import { app } from "../../src";
import { cleanUpDatabase } from "../../src/db/test-utils";

describe("auth", () => {
  beforeAll(() => {
    cleanUpDatabase();
  })

  it("should create a user", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))

    const body = await response.json();

    expect(response.status).toEqual(201);
    expect(body).toEqual({
      message: "User created successfully",
    });
  });

  it("should not create a user with the same username", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))

    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User already exists",
    });
  });

  it("should login a user", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      message: "User logged in successfully",
    });
    expect(response.headers.get("set-cookie")).toMatch(/token=.+;/);
  });

  it("should not login a user with wrong password", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "wrong-password",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User not found",
    });
  });

  it("should not login a user with wrong username", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "wrong-username",
          password: "password",
        })
      }))
    const body = await response.json();
      
    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User not found",
    });
  });

  afterAll(() => {
    cleanUpDatabase();
  })
});