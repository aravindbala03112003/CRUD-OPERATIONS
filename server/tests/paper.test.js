const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');

describe('Research Papers API - Complete Integration & CRUD Test Suite', () => {
  // 1. Health check
  test('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  // 2. READ ALL PAPERS (Pagination, Search, Filter, Sort)
  describe('GET /api/papers - Read All & Filtering', () => {
    test('should retrieve papers with default pagination and sorting (publicationDate desc)', async () => {
      const res = await request(app).get('/api/papers');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.count >= 1);
      assert.equal(res.body.pagination.page, 1);
      assert.equal(res.body.pagination.limit, 10);
      assert.ok(res.body.pagination.totalItems >= 50);
      // Top paper should be P-105 matching the screenshot
      assert.equal(res.body.data[0].paperId, 'P-105');
    });

    test('should search by title', async () => {
      const res = await request(app).get('/api/papers?search=Recommendation');

      assert.equal(res.status, 200);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].paperId, 'P-105');
    });

    test('should search by author', async () => {
      const res = await request(app).get('/api/papers?search=Lamport');

      assert.equal(res.status, 200);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].author, 'Leslie Lamport');
    });

    test('should search by paperId', async () => {
      const res = await request(app).get('/api/papers?search=P-3040');

      assert.equal(res.status, 200);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].paperId, 'P-3040');
    });

    test('should filter by price range', async () => {
      const res = await request(app).get('/api/papers?minPrice=1700&maxPrice=2000');

      assert.equal(res.status, 200);
      assert.ok(res.body.count >= 1);
      res.body.data.forEach((p) => {
        assert.ok(p.price >= 1700 && p.price <= 2000);
      });
    });

    test('should sort by price in ascending order', async () => {
      const res = await request(app).get('/api/papers?sortBy=price&order=asc&limit=5');

      assert.equal(res.status, 200);
      assert.ok(res.body.data[0].price <= res.body.data[1].price);
    });

    test('should paginate correctly with limit=5', async () => {
      const resPage1 = await request(app).get('/api/papers?page=1&limit=5');
      assert.equal(resPage1.status, 200);
      assert.equal(resPage1.body.data.length, 5);
      assert.equal(resPage1.body.pagination.page, 1);
      assert.equal(resPage1.body.pagination.limit, 5);

      const resPage2 = await request(app).get('/api/papers?page=2&limit=5');
      assert.equal(resPage2.status, 200);
      assert.equal(resPage2.body.data.length, 5);
      assert.equal(resPage2.body.pagination.page, 2);
      assert.notEqual(resPage1.body.data[0].paperId, resPage2.body.data[0].paperId);
    });

    test('should return empty list when search yields no matches', async () => {
      const res = await request(app).get('/api/papers?search=NonExistentSubjectXYZ999');

      assert.equal(res.status, 200);
      assert.equal(res.body.count, 0);
      assert.equal(res.body.data.length, 0);
      assert.equal(res.body.pagination.totalItems, 0);
    });
  });

  // 3. CREATE PAPER
  describe('POST /api/papers - Create Paper', () => {
    test('should create a valid research paper', async () => {
      const uniqueId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
      const paperData = {
        paperId: uniqueId,
        title: 'Novel Quantum Machine Learning Algorithms',
        author: 'Maria Curie',
        publicationDate: '2025-09-15',
        price: 4500.0,
      };

      const res = await request(app).post('/api/papers').send(paperData);

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.paperId, uniqueId);
      assert.equal(res.body.data.title, 'Novel Quantum Machine Learning Algorithms');
      assert.equal(res.body.data.price, 4500.0);
    });

    test('should reject paper with missing required fields', async () => {
      const res = await request(app).post('/api/papers').send({
        paperId: 'P-999',
        title: '',
      });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    test('should reject duplicate paperId with 409 Conflict', async () => {
      const res = await request(app).post('/api/papers').send({
        paperId: 'P-105', // Already exists in seed
        title: 'Duplicate Paper',
        author: 'John Doe',
        publicationDate: '2025-09-01',
        price: 1200,
      });

      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /already exists/i);
    });

    test('should reject negative price', async () => {
      const res = await request(app).post('/api/papers').send({
        paperId: 'P-99991',
        title: 'Negative Price Paper',
        author: 'Test Author',
        publicationDate: '2025-01-01',
        price: -500,
      });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /non-negative/i);
    });

    test('should reject invalid publication date', async () => {
      const res = await request(app).post('/api/papers').send({
        paperId: 'P-99992',
        title: 'Invalid Date Paper',
        author: 'Test Author',
        publicationDate: 'not-a-date',
        price: 500,
      });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 4. READ BY ID
  describe('GET /api/papers/:id - Read by ID', () => {
    test('should retrieve paper by ID', async () => {
      const listRes = await request(app).get('/api/papers?limit=1');
      const target = listRes.body.data[0];

      const res = await request(app).get(`/api/papers/${target._id}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.paperId, target.paperId);
      assert.equal(res.body.data.title, target.title);
    });

    test('should return 404 for non-existent ID', async () => {
      const res = await request(app).get('/api/papers/67b3ffffffffffffffffffff');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });

    test('should retrieve paper by business paperId via /by-paper-id/:paperId', async () => {
      const res = await request(app).get('/api/papers/by-paper-id/P-105');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, 'Food Recommendation System');
    });
  });

  // 5. UPDATE PAPER
  describe('PUT /api/papers/:id - Update Paper', () => {
    test('should update paper fields successfully', async () => {
      const listRes = await request(app).get('/api/papers?search=P-105');
      const target = listRes.body.data[0];

      const res = await request(app)
        .put(`/api/papers/${target._id}`)
        .send({
          title: 'Advanced Food Recommendation System',
          price: 50000.0,
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, 'Advanced Food Recommendation System');
      assert.equal(res.body.data.price, 50000.0);
    });

    test('should return 400 when updating price to negative value', async () => {
      const listRes = await request(app).get('/api/papers?limit=1');
      const target = listRes.body.data[0];

      const res = await request(app)
        .put(`/api/papers/${target._id}`)
        .send({ price: -100 });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    test('should return 404 for updating non-existent paper', async () => {
      const res = await request(app)
        .put('/api/papers/67b3ffffffffffffffffffff')
        .send({ title: 'New Title' });

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  // 6. DELETE PAPER
  describe('DELETE /api/papers/:id - Delete Paper', () => {
    test('should delete paper and return 200', async () => {
      // Create a dedicated paper to delete
      const uniqueId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
      const createRes = await request(app).post('/api/papers').send({
        paperId: uniqueId,
        title: 'Temporary Paper To Delete',
        author: 'Temp Author',
        publicationDate: '2025-01-01',
        price: 999,
      });

      const paperToDelete = createRes.body.data;

      const deleteRes = await request(app).delete(`/api/papers/${paperToDelete._id}`);
      assert.equal(deleteRes.status, 200);
      assert.equal(deleteRes.body.success, true);

      // Verify subsequent GET returns 404
      const getRes = await request(app).get(`/api/papers/${paperToDelete._id}`);
      assert.equal(getRes.status, 404);
    });

    test('should return 404 when deleting non-existent paper', async () => {
      const res = await request(app).delete('/api/papers/67b3ffffffffffffffffffff');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });
});
