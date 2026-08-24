var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var pokemons = new List<Pokemon>
{
    new(1, "Bulbasaur", "Grass/Poison"),
    new(2, "Ivysaur", "Grass/Poison"),
    new(3, "Venusaur", "Grass/Poison"),
    new(4, "Charmander", "Fire"),
    new(5, "Charmeleon", "Fire"),
    new(6, "Charizard", "Fire/Flying"),
    new(7, "Squirtle", "Water"),
    new(8, "Wartortle", "Water"),
    new(9, "Blastoise", "Water"),
    new(10, "Pikachu", "Electric")
};

app.MapGet("/pokemons", () => Results.Ok(pokemons));

app.MapGet("/pokemons/{id:int}", (int id) =>
{
    var pokemon = pokemons.FirstOrDefault(p => p.Id == id);

    return pokemon is null
        ? Results.NotFound(new { message = $"Pokemon with id {id} was not found." })
        : Results.Ok(pokemon);
});

app.Run();

internal record Pokemon(int Id, string Name, string Type);
