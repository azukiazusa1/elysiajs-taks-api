import { afterAll, beforeAll, describe, it, expect } from "bun:test";
import { app } from "../../src";
import { cleanUpDatabase, createUser } from "../../src/db/test-utils";

describe("tasks", () => {
  let cookie: string;

  beforeAll(async () => {
    cleanUpDatabase();
    await createUser({
      username: "alice",
      password: "password",
    });
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
    cookie = response.headers.get("set-cookie")!;
  })

  it("should not create a task without a cookie", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "in-progress",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: "Unauthorized",
    });
  });

  it("should create a task", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "in-progress",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      task: {
        id: expect.any(String),
        name: "Buy milk",
        status: "in-progress",
      }
    });
  });

  it("should validate task dto", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "invalid-status",
        })
      }))
    const body = await response.text();

    expect(response.status).toEqual(400);
    expect(body).toEqual("Invalid body, 'status': Expected value of union\n\nExpected: {\n  \"name\": \"\",\n  \"status\": \"done\"\n}\n\nFound: {\n  \"name\": \"Buy milk\",\n  \"status\": \"invalid-status\"\n}");
  });

  it("should not get tasks without a cookie", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }))
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: "Unauthorized",
    });
  });

  it("should get tasks", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        },
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      tasks: [
        {
          id: expect.any(String),
          name: "Buy milk",
          status: "in-progress"
        }
      ]
    });
  });
});