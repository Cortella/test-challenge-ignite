import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("123456", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at, updated_at) 
      VALUES ('${id}', 'admin', 'cortella@ufmg.br', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get an statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "cortella@ufmg.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(deposit.body).toHaveProperty("type");
  });
});