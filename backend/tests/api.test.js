const request = require('supertest');
const app = require('../src/app'); // Assumes express app is exported from app.js

describe('Backend API Automated Tests', () => {
  it('should fetch the current traffic state', async () => {
    const res = await request(app).get('/api/traffic/current');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('lanes');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 400 for invalid manual override', async () => {
    const res = await request(app).post('/api/signals/override').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should successfully trigger emergency mode', async () => {
    const res = await request(app)
      .post('/api/emergency/trigger')
      .send({ lane: 'NORTH', vehicleType: 'ambulance' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should get analytics stats', async () => {
    const res = await request(app).get('/api/analytics/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalVehicles');
    expect(res.body).toHaveProperty('aiScore');
  });
});
