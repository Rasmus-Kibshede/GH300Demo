const express = require('express');

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

const app = express();

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

module.exports = app;
