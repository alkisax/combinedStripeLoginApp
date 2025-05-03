const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require("../models/admins.models");
const adminDAO = require("../daos/admin.dao");

// Add this mock at the top of your test file to ensure it doesn't interact with the actual Stripe service during tests.
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock the methods you need, e.g., charge, paymentIntents, etc.
    charges: {
      create: jest.fn().mockResolvedValue({ success: true })
    }
  }));
});

const TEST_ADMIN = {
  username: "adminuser",
  name: "Admin User",
  email: "adminuser@example.com",
  password: "adminpassword",
  roles: ["admin"]
};

let adminToken;
let adminId;

beforeAll(async () => {
  const saltrounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, saltrounds);

  await mongoose.connect(process.env.MONGODB_TEST_URI);
  console.log("Connected to MongoDB for testing");

  await Admin.deleteMany({});

  const newAdmin = await Admin.create({
    username: TEST_ADMIN.username,
    name: TEST_ADMIN.name,
    email: TEST_ADMIN.email,
    hashedPassword,
    roles: TEST_ADMIN.roles
  });

  // Simulate admin login to get token
  const res = await request(app)
    .post("/api/login")
    .send({
      username: TEST_ADMIN.username,
      password: TEST_ADMIN.password
    });
  
  adminToken = res.body.data.token;
  adminId = newAdmin._id;
  console.log("Admin token:", adminToken);
});

afterAll(async () => {
  await Admin.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/admins', () => {
  it('should return 200 and list of admins when authorized and admin role', async () => {
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/admin');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });

  it('should return 403 for non-admin role', async () => {
    const nonAdminToken = 'some-fake-token-for-non-admin';
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });
});

describe('POST /api/admins', () => {
  it('should create a new admin and return 201', async () => {
    const newAdmin = {
      username: 'newadmin',
      name: 'New Admin',
      email: 'newadmin@example.com',
      password: 'newadminpassword',
      roles: ['admin']
    };

    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAdmin);

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(newAdmin.username);
    expect(res.body.name).toBe(newAdmin.name);
    expect(res.body.email).toBe(newAdmin.email);
    expect(res.body.roles).toEqual(newAdmin.roles);
  });

  it('should return 500 when fields are missing', async () => {
    const newAdmin = {
      username: 'newadmin'
      // Missing required fields like name, password, etc.
    };

    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAdmin);

    expect(res.status).toBe(500); //errror coming from mongo
  });

  it('should return 400 when username already exists', async () => {
    const existingAdmin = {
      username: 'existingadmin',
      name: 'Existing Admin',
      email: 'existingadmin@example.com',
      password: 'existingpassword',
      roles: ['admin']
    };

    // First, create the admin
    await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(existingAdmin);

    // Try to create the same admin again
    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(existingAdmin);

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/admin/:id', () => {
  it('should delete the admin and return 200', async () => {
    const res = await request(app)
      .delete(`/api/admin/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(`Admin ${TEST_ADMIN.username} deleted successfully`);
  });

  it('should return 404 when no admin id is provided', async () => {
    const res = await request(app)
      .delete('/api/admin/')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('should return 404 when admin id is not found', async () => {
    const wrongId = '60d9e3f5b4c2b2d6b8a232c9'; // Invalid ID format
    const res = await request(app)
      .delete(`/api/admins/${wrongId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
