import { agent, prisma, cleanDatabase, registerUser } from "./helpers";

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("POST /api/auth/register", () => {
  it("registers a new user and returns token", async () => {
    const res = await agent.post("/api/auth/register").send({
      email: "new@example.com",
      password: "password123",
      name: "New User",
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      email: "new@example.com",
      name: "New User",
    });
    expect(res.body.user.id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("rejects duplicate email", async () => {
    await registerUser();

    const res = await agent.post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Another User",
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain("already registered");
  });

  it("rejects invalid email", async () => {
    const res = await agent.post("/api/auth/register").send({
      email: "not-an-email",
      password: "password123",
      name: "Test",
    });

    expect(res.status).toBe(400);
  });

  it("rejects short password", async () => {
    const res = await agent.post("/api/auth/register").send({
      email: "test@example.com",
      password: "short",
      name: "Test",
    });

    expect(res.status).toBe(400);
  });

  it("rejects missing name", async () => {
    const res = await agent.post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("logs in with valid credentials", async () => {
    const res = await agent.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password", async () => {
    const res = await agent.post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Invalid");
  });

  it("rejects non-existent email", async () => {
    const res = await agent.post("/api/auth/login").send({
      email: "noone@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns user profile with valid token", async () => {
    const reg = await registerUser();
    const token = reg.body.token;

    const res = await agent
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.name).toBe("Test User");
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("rejects request without token", async () => {
    const res = await agent.get("/api/auth/me");

    expect(res.status).toBe(401);
  });

  it("rejects invalid token", async () => {
    const res = await agent
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
  });
});
