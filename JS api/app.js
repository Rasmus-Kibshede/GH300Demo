import express from 'express';

const pokemon = [
  { id: 1, name: 'Bulbasaur', type: ['Grass', 'Poison'] },
  { id: 2, name: 'Ivysaur', type: ['Grass', 'Poison'] },
  { id: 3, name: 'Venusaur', type: ['Grass', 'Poison'] },
  { id: 4, name: 'Charmander', type: ['Fire'] },
  { id: 5, name: 'Charmeleon', type: ['Fire'] },
  { id: 6, name: 'Charizard', type: ['Fire', 'Flying'] },
  { id: 7, name: 'Squirtle', type: ['Water'] },
  { id: 8, name: 'Wartortle', type: ['Water'] },
  { id: 9, name: 'Blastoise', type: ['Water'] },
  { id: 10, name: 'Pikachu', type: ['Electric'] }
];
let nextPokemonId = pokemon.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

const app = express();
app.use(express.json());

const isValidPokemonPayload = (payload) =>
  typeof payload?.name === 'string' &&
  payload.name.length > 0 &&
  Array.isArray(payload.type) &&
  payload.type.length > 0 &&
  payload.type.every((value) => typeof value === 'string' && value.length > 0);

app.get('/api/pokemon', (_request, response) => {
  response.json({ data: pokemon });
});

app.get('/api/pokemon/:id', (request, response) => {
  const id = Number.parseInt(request.params.id, 10);
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
  if (!isValidPokemonPayload(request.body)) {
    return response.status(400).json({ error: 'Invalid pokemon payload' });
  }

  const id = Number.parseInt(request.params.id, 10);
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
  const id = Number.parseInt(request.params.id, 10);
  const index = pokemon.findIndex((item) => item.id === id);

  if (index === -1) {
    return response.status(404).json({ error: 'Pokemon not found' });
  }

  const [deletedPokemon] = pokemon.splice(index, 1);

  return response.json({ data: deletedPokemon });
});

export default app;
