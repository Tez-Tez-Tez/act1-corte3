const request = require('supertest');
const app = require('../src/app');

describe('GET /api/players', () => {
  it('should return an array of players', async () => {
    const res = await request(app).get('/api/players');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should have players with required fields', async () => {
    const res = await request(app).get('/api/players');
    if (res.body.length > 0) {
      const player = res.body[0];
      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('name');
      expect(player).toHaveProperty('position');
      expect(player).toHaveProperty('team');
      expect(player).toHaveProperty('goals');
      expect(player).toHaveProperty('assists');
    }
  });
});

describe('POST /api/players', () => {
  it('should create a new player', async () => {
    const newPlayer = {
      name: 'Test Player',
      position: 'Midfielder',
      team: 'Test FC',
      goals: 5,
      assists: 3,
      matches: 10,
    };
    const res = await request(app)
      .post('/api/players')
      .send(newPlayer)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Player');
  });
});

describe('DELETE /api/players/:id', () => {
  it('should delete an existing player', async () => {
    const newPlayer = {
      name: 'Delete Me',
      position: 'Defender',
      team: 'Test FC',
      goals: 1,
      assists: 0,
      matches: 5,
    };
    const createRes = await request(app)
      .post('/api/players')
      .send(newPlayer)
      .set('Content-Type', 'application/json');
    const playerId = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/players/${playerId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Player deleted');
  });

  it('should return 404 for non-existent player', async () => {
    const res = await request(app).delete('/api/players/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Player not found');
  });
});
