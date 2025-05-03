const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
require('dotenv').config();
const app = require("../app");

const Admin = require("../models/admins.models");

// Add this mock at the top of your test file to ensure it doesn't interact with the actual Stripe service during tests.
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock the methods you need, e.g., charge, paymentIntents, etc.
    charges: {
      create: jest.fn().mockResolvedValue({ success: true })
    }
  }));
});


const TEST_ADMIN_LOGIN = {
  username: "adminuser",
  name: "Admin User",
  email: "admin@example.com",
  password: "securepassword",
  roles: ["admin"]
};

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await Admin.deleteMany({});

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_ADMIN_LOGIN.password, saltRounds);

  await Admin.create({
    username: TEST_ADMIN_LOGIN.username,
    name: TEST_ADMIN_LOGIN.name,
    email: TEST_ADMIN_LOGIN.email,
    hashedPassword: hashedPassword,
    roles: TEST_ADMIN_LOGIN.roles
  });
});

afterAll(async () => {
  await Admin.deleteMany({});
  await mongoose.disconnect();
});

describe("POST /api/login", () => {
  it("should return token and admin data for valid credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username,
        password: TEST_ADMIN_LOGIN.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.admin).toMatchObject({
      username: TEST_ADMIN_LOGIN.username,
      email: TEST_ADMIN_LOGIN.email,
      roles: TEST_ADMIN_LOGIN.roles
    });
  });

  it("should fail with incorrect password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username,
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("should fail with non-existent username", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: "ghostuser",
        password: "anyPassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid username or password or admin not found");
  });

  it("should fail if username is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        password: TEST_ADMIN_LOGIN.password
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Username is required");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Password is required");
  });
});
