const request = require("supertest");
const app = require("../src/app");
const { setup, clearDatabase, teardown } = require("./setup");

beforeAll(async () => {
  await setup();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await teardown();
});

const validWine = {
  name: "Château Margaux 2015",
  producer: "Château Margaux",
  vintage: 2015,
  type: "Red",
  grape: "Cabernet Sauvignon",
  region: "Bordeaux",
  country: "France",
  quantity: 2,
  price: 450,
  rating: 5,
  notes: "Exceptional vintage",
  status: "In Cellar",
};

describe("POST /wines", () => {
  it("should create a wine with valid data and return 201", async () => {
    const res = await request(app).post("/wines").send(validWine);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      name: validWine.name,
      producer: validWine.producer,
      vintage: validWine.vintage,
      type: validWine.type,
      grape: validWine.grape,
      region: validWine.region,
      country: validWine.country,
      quantity: validWine.quantity,
      price: validWine.price,
      rating: validWine.rating,
      notes: validWine.notes,
      status: validWine.status,
    });
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
    expect(res.body.data.updatedAt).toBeDefined();
  });

  it("should create a wine with only required fields and apply defaults", async () => {
    const minWine = { name: "Simple Wine", producer: "Simple Producer", type: "White" };
    const res = await request(app).post("/wines").send(minWine);

    expect(res.status).toBe(201);
    expect(res.body.data.quantity).toBe(1);
    expect(res.body.data.status).toBe("In Cellar");
    expect(res.body.data.grape).toBe("");
    expect(res.body.data.notes).toBe("");
  });

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/wines").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details).toBeInstanceOf(Array);
    expect(res.body.details.length).toBeGreaterThanOrEqual(3); // name, producer, type
  });

  it("should return 400 when name is missing", async () => {
    const res = await request(app)
      .post("/wines")
      .send({ ...validWine, name: undefined });

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.path === "name")).toBe(true);
  });

  it("should return 400 for invalid wine type", async () => {
    const res = await request(app)
      .post("/wines")
      .send({ ...validWine, type: "Invalid" });

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.path === "type")).toBe(true);
  });

  it("should return 400 when vintage is out of range", async () => {
    const res = await request(app)
      .post("/wines")
      .send({ ...validWine, vintage: 1800 });

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.path === "vintage")).toBe(true);
  });

  it("should return 400 when rating is out of range", async () => {
    const res = await request(app)
      .post("/wines")
      .send({ ...validWine, rating: 10 });

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.path === "rating")).toBe(true);
  });

  it("should return 400 when quantity is negative", async () => {
    const res = await request(app)
      .post("/wines")
      .send({ ...validWine, quantity: -1 });

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.path === "quantity")).toBe(true);
  });
});

describe("GET /wines", () => {
  beforeEach(async () => {
    // Seed some wines for GET tests
    await request(app).post("/wines").send(validWine);
    await request(app)
      .post("/wines")
      .send({ ...validWine, name: "White Burg", type: "White", status: "Consumed" });
    await request(app)
      .post("/wines")
      .send({ ...validWine, name: "Rosé Summer", type: "Rosé", status: "Wishlist" });
  });

  it("should return all wines", async () => {
    const res = await request(app).get("/wines");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);
  });

  it("should filter wines by type", async () => {
    const res = await request(app).get("/wines?type=Red");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].type).toBe("Red");
  });

  it("should filter wines by status", async () => {
    const res = await request(app).get("/wines?status=Consumed");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("Consumed");
  });

  it("should search wines by name (text search)", async () => {
    const res = await request(app).get("/wines?search=Margaux");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.some((w) => w.name.includes("Margaux"))).toBe(true);
  });

  it("should search wines by short term (regex fallback)", async () => {
    const res = await request(app).get("/wines?search=Ro");

    expect(res.status).toBe(200);
    expect(res.body.data.some((w) => w.name.includes("Rosé") || w.type === "Rosé")).toBe(true);
  });

  it("should combine type and status filters (AND logic)", async () => {
    const res = await request(app).get("/wines?type=Red&status=In%20Cellar");

    expect(res.status).toBe(200);
    expect(res.body.data.every((w) => w.type === "Red" && w.status === "In Cellar")).toBe(true);
  });

  it("should return empty array when no wines match", async () => {
    const res = await request(app).get("/wines?type=Fortified");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("should return 400 for invalid type filter", async () => {
    const res = await request(app).get("/wines?type=Invalid");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /wines/:id", () => {
  let wineId;

  beforeEach(async () => {
    const res = await request(app).post("/wines").send(validWine);
    wineId = res.body.data._id;
  });

  it("should return a wine by ID", async () => {
    const res = await request(app).get(`/wines/${wineId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(wineId);
    expect(res.body.data.name).toBe(validWine.name);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app).get("/wines/507f1f77bcf86cd799439011");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/wines/not-a-valid-id");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("PUT /wines/:id", () => {
  let wineId;

  beforeEach(async () => {
    const res = await request(app).post("/wines").send(validWine);
    wineId = res.body.data._id;
  });

  it("should update a wine with valid data", async () => {
    const res = await request(app)
      .put(`/wines/${wineId}`)
      .send({ rating: 4, notes: "Updated note" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rating).toBe(4);
    expect(res.body.data.notes).toBe("Updated note");
    // Other fields should remain unchanged
    expect(res.body.data.name).toBe(validWine.name);
  });

  it("should allow partial update (single field)", async () => {
    const res = await request(app)
      .put(`/wines/${wineId}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(10);
    expect(res.body.data.name).toBe(validWine.name);
  });

  it("should return 400 for invalid update data", async () => {
    const res = await request(app)
      .put(`/wines/${wineId}`)
      .send({ rating: 99 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .put("/wines/507f1f77bcf86cd799439011")
      .send({ rating: 3 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app)
      .put("/wines/bad-id")
      .send({ rating: 3 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /wines/:id", () => {
  let wineId;

  beforeEach(async () => {
    const res = await request(app).post("/wines").send(validWine);
    wineId = res.body.data._id;
  });

  it("should delete a wine and return success", async () => {
    const res = await request(app).delete(`/wines/${wineId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();

    // Verify it's actually gone
    const getRes = await request(app).get(`/wines/${wineId}`);
    expect(getRes.status).toBe(404);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app).delete("/wines/507f1f77bcf86cd799439011");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).delete("/wines/invalid");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
