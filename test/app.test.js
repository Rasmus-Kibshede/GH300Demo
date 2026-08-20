import assert from 'node:assert/strict';
import { after, test } from 'node:test';

import app from '../app.js';

const server = app.listen(0);
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

after(() => {
  server.close();
});

test('GET /api/pokemon returns 10 pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.length, 10);
  assert.deepEqual(body.data[0], {
    id: 1,
    name: 'Bulbasaur',
    type: ['Grass', 'Poison']
  });
});

test('GET /api/pokemon/:id returns one pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/10`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.data, {
    id: 10,
    name: 'Pikachu',
    type: ['Electric']
  });
});

test('GET /api/pokemon/:id returns 404 for missing pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/999`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error, 'Pokemon not found');
});
