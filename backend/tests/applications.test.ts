import { agent, prisma, cleanDatabase, registerUser } from "./helpers";

let token: string;

beforeEach(async () => {
  await cleanDatabase();
  const res = await registerUser();
  token = res.body.token;
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

function authAgent() {
  return { set: (req: ReturnType<typeof agent.get>) => req.set("Authorization", `Bearer ${token}`) };
}

function authed(req: ReturnType<typeof agent.get>) {
  return req.set("Authorization", `Bearer ${token}`);
}

describe("POST /api/applications", () => {
  it("creates a new application", async () => {
    const res = await authed(
      agent.post("/api/applications").send({
        company: "Acme Corp",
        position: "Senior Developer",
        url: "https://acme.com/jobs/123",
        notes: "Interesting role",
        techStack: ["React", "Node.js"],
      }),
    );

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      company: "Acme Corp",
      position: "Senior Developer",
      status: "APPLIED",
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.techStack).toEqual(["React", "Node.js"]);
  });

  it("creates with minimal data", async () => {
    const res = await authed(
      agent.post("/api/applications").send({
        company: "Startup Inc",
        position: "Developer",
      }),
    );

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("APPLIED");
    expect(res.body.techStack).toEqual([]);
  });

  it("rejects missing company", async () => {
    const res = await authed(
      agent.post("/api/applications").send({
        position: "Developer",
      }),
    );

    expect(res.status).toBe(400);
  });

  it("rejects without auth", async () => {
    const res = await agent.post("/api/applications").send({
      company: "Test",
      position: "Dev",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/applications", () => {
  it("lists user applications", async () => {
    await authed(
      agent.post("/api/applications").send({
        company: "Company A",
        position: "Dev",
      }),
    );
    await authed(
      agent.post("/api/applications").send({
        company: "Company B",
        position: "Dev",
      }),
    );

    const res = await authed(agent.get("/api/applications"));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("does not show other users applications", async () => {
    await authed(
      agent.post("/api/applications").send({
        company: "My Company",
        position: "Dev",
      }),
    );

    const other = await registerUser({
      email: "other@example.com",
      password: "password123",
      name: "Other",
    });
    const otherToken = other.body.token;

    const res = await agent
      .get("/api/applications")
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("GET /api/applications/:id", () => {
  it("returns a single application", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "Test Co",
        position: "Dev",
      }),
    );

    const res = await authed(
      agent.get(`/api/applications/${created.body.id}`),
    );

    expect(res.status).toBe(200);
    expect(res.body.company).toBe("Test Co");
  });

  it("returns 404 for other users application", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "Secret",
        position: "Dev",
      }),
    );

    const other = await registerUser({
      email: "other@example.com",
      password: "password123",
      name: "Other",
    });

    const res = await agent
      .get(`/api/applications/${created.body.id}`)
      .set("Authorization", `Bearer ${other.body.token}`);

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/applications/:id", () => {
  it("updates an application", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "Old Name",
        position: "Dev",
      }),
    );

    const res = await authed(
      agent.put(`/api/applications/${created.body.id}`).send({
        company: "New Name",
        salary: "$100k",
      }),
    );

    expect(res.status).toBe(200);
    expect(res.body.company).toBe("New Name");
    expect(res.body.salary).toBe("$100k");
  });
});

describe("PATCH /api/applications/:id/status", () => {
  it("updates application status", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "Test",
        position: "Dev",
      }),
    );

    const res = await authed(
      agent.patch(`/api/applications/${created.body.id}/status`).send({
        status: "INTERVIEW",
      }),
    );

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("INTERVIEW");
  });

  it("rejects invalid status", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "Test",
        position: "Dev",
      }),
    );

    const res = await authed(
      agent.patch(`/api/applications/${created.body.id}/status`).send({
        status: "INVALID",
      }),
    );

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/applications/:id", () => {
  it("deletes an application", async () => {
    const created = await authed(
      agent.post("/api/applications").send({
        company: "To Delete",
        position: "Dev",
      }),
    );

    const res = await authed(
      agent.delete(`/api/applications/${created.body.id}`),
    );

    expect(res.status).toBe(204);

    const check = await authed(
      agent.get(`/api/applications/${created.body.id}`),
    );
    expect(check.status).toBe(404);
  });

  it("returns 404 for non-existent application", async () => {
    const res = await authed(
      agent.delete("/api/applications/00000000-0000-0000-0000-000000000000"),
    );

    expect(res.status).toBe(404);
  });
});
