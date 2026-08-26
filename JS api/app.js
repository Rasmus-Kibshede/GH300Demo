import express from 'express';
import { readFileSync } from 'node:fs';

const pokemon = JSON.parse(readFileSync(new URL('./pokemon.json', import.meta.url), 'utf8'));
let nextPokemonId = pokemon.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

const app = express();
app.use(express.json());

const isValidPokemonPayload = (payload) =>
  typeof payload?.name === 'string' &&
  payload.name.length > 0 &&
  Array.isArray(payload.type) &&
  payload.type.length > 0 &&
  payload.type.every((value) => typeof value === 'string' && value.length > 0);

const parsePokemonId = (value) => {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

app.get('/api/pokemon', (_request, response) => {
  response.json({ data: pokemon });
});

app.get('/api/pokemon/:id', (request, response) => {
  const id = parsePokemonId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Invalid pokemon id' });
  }

  const selectedPokemon = pokemon.find((item) => item.id === id);

  if (!selectedPokemon) {
    return response.status(404).json({ error: 'Pokemon not found' });
  }

  return response.json({ data: selectedPokemon });
});

app.post('/api/pokemon', (request, response) => {
  if (!isValidPokemonPayload(request.body)) {
    return response.status(400).json({ error: 'Invalid pokemon payload' });
  }

  const newPokemon = {
    id: nextPokemonId,
    name: request.body.name,
    type: request.body.type
  };

  pokemon.push(newPokemon);
  nextPokemonId += 1;

  return response.status(201).json({ data: newPokemon });
});

app.put('/api/pokemon/:id', (request, response) => {
  const id = parsePokemonId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Invalid pokemon id' });
  }

  if (!isValidPokemonPayload(request.body)) {
    return response.status(400).json({ error: 'Invalid pokemon payload' });
  }

  const index = pokemon.findIndex((item) => item.id === id);

  if (index === -1) {
    return response.status(404).json({ error: 'Pokemon not found' });
  }

  const updatedPokemon = {
    ...pokemon[index],
    name: request.body.name,
    type: request.body.type
  };

  pokemon[index] = updatedPokemon;

  return response.json({ data: updatedPokemon });
});

app.delete('/api/pokemon/:id', (request, response) => {
  const id = parsePokemonId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Invalid pokemon id' });
  }

  const index = pokemon.findIndex((item) => item.id === id);

  if (index === -1) {
    return response.status(404).json({ error: 'Pokemon not found' });
  }

  const [deletedPokemon] = pokemon.splice(index, 1);

  return response.json({ data: deletedPokemon });
});

export default app;
