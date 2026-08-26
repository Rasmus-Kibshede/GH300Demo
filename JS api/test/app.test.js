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

test('GET /api/pokemon/:id returns 400 for invalid id', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/not-a-number`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon id');
});

test('GET /api/pokemon/:id returns 400 for partially numeric id', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/12abc`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon id');
});

test('POST /api/pokemon adds a pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Mew',
      type: ['Psychic']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.data.name, 'Mew');
  assert.deepEqual(body.data.type, ['Psychic']);
  assert.equal(typeof body.data.id, 'number');
});

test('PUT /api/pokemon/:id updates one pokemon', async () => {
  const createResponse = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Pidgey',
      type: ['Normal', 'Flying']
    })
  });
  const createBody = await createResponse.json();

  const response = await fetch(`${baseUrl}/api/pokemon/${createBody.data.id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Raichu',
      type: ['Electric']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.data, {
    id: createBody.data.id,
    name: 'Raichu',
    type: ['Electric']
  });
});

test('DELETE /api/pokemon/:id deletes one pokemon', async () => {
  const createResponse = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Snorlax',
      type: ['Normal']
    })
  });
  const createBody = await createResponse.json();

  const response = await fetch(`${baseUrl}/api/pokemon/${createBody.data.id}`, {
    method: 'DELETE'
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.data, {
    id: createBody.data.id,
    name: 'Snorlax',
    type: ['Normal']
  });

  const verifyResponse = await fetch(`${baseUrl}/api/pokemon/${createBody.data.id}`);
  const verifyBody = await verifyResponse.json();

  assert.equal(verifyResponse.status, 404);
  assert.equal(verifyBody.error, 'Pokemon not found');
});

test('POST /api/pokemon returns 400 for empty name', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: '',
      type: ['Grass']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon payload');
});

test('POST /api/pokemon returns 400 for non-array type', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Oddish',
      type: 'Grass'
    })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon payload');
});

test('PUT /api/pokemon/:id returns 400 for invalid payload', async () => {
  const createResponse = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Ditto',
      type: ['Normal']
    })
  });
  const createBody = await createResponse.json();

  const response = await fetch(`${baseUrl}/api/pokemon/${createBody.data.id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: '',
      type: ['Normal']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon payload');
});

test('PUT /api/pokemon/:id returns 400 for invalid id', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/not-a-number`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Ditto',
      type: ['Normal']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon id');
});

test('PUT /api/pokemon/:id returns 404 for missing pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/999999`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Unknown',
      type: ['Normal']
    })
  });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error, 'Pokemon not found');
});

test('POST /api/pokemon keeps incrementing ids after delete', async () => {
  const firstCreateResponse = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Abra',
      type: ['Psychic']
    })
  });
  const firstCreateBody = await firstCreateResponse.json();

  await fetch(`${baseUrl}/api/pokemon/${firstCreateBody.data.id}`, {
    method: 'DELETE'
  });

  const secondCreateResponse = await fetch(`${baseUrl}/api/pokemon`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Kadabra',
      type: ['Psychic']
    })
  });
  const secondCreateBody = await secondCreateResponse.json();

  assert.equal(secondCreateResponse.status, 201);
  assert.equal(secondCreateBody.data.id, firstCreateBody.data.id + 1);
});

test('DELETE /api/pokemon/:id returns 400 for invalid id', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/not-a-number`, {
    method: 'DELETE'
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid pokemon id');
});

test('DELETE /api/pokemon/:id returns 404 for missing pokemon', async () => {
  const response = await fetch(`${baseUrl}/api/pokemon/999999`, {
    method: 'DELETE'
  });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error, 'Pokemon not found');
});
