var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IPokemonService, PokemonService>();

var app = builder.Build();

app.MapGet("/pokemons", (IPokemonService service) => Results.Ok(service.GetAll()));

app.MapGet("/pokemons/{id:int}", (int id, IPokemonService service) =>
{
    var pokemon = service.GetById(id);

    return pokemon is null
        ? Results.NotFound(new { message = $"Pokemon with id {id} was not found." })
        : Results.Ok(pokemon);
});


app.MapGet("/pokemons/type/{type}", (string type, IPokemonService service) =>
{
    if (!Enum.TryParse<PokemonType>(type, true, out var pokemonType))
    {
        return Results.BadRequest(new { message = $"Invalid Pokemon type: {type}" });
    }

    var pokemonsOfType = service.GetByType(pokemonType).ToList();

    return !pokemonsOfType.Any()
        ? Results.NotFound(new { message = $"No Pokemon of type {pokemonType} was found." })
        : Results.Ok(pokemonsOfType);
});

app.Run();

// Simple Pokemon service implementation
public interface IPokemonService
{
    IEnumerable<Pokemon> GetAll();
    Pokemon? GetById(int id);
    IEnumerable<Pokemon> GetByType(PokemonType type);
}

public class PokemonService : IPokemonService
{
    private readonly List<Pokemon> _pokemons =
    [
        new(1, "Bulbasaur", [PokemonType.Grass, PokemonType.Poison]),
        new(2, "Ivysaur", [PokemonType.Grass, PokemonType.Poison]),
        new(3, "Venusaur", [PokemonType.Grass, PokemonType.Poison]),
        new(4, "Charmander", [PokemonType.Fire]),
        new(5, "Charmeleon", [PokemonType.Fire]),
        new(6, "Charizard", [PokemonType.Fire, PokemonType.Flying]),
        new(7, "Squirtle", [PokemonType.Water]),
        new(8, "Wartortle", [PokemonType.Water]),
        new(9, "Blastoise", [PokemonType.Water]),
        new(10, "Pikachu", [PokemonType.Electric])
    ];

    public IEnumerable<Pokemon> GetAll() => _pokemons;

    public Pokemon? GetById(int id) => _pokemons.FirstOrDefault(p => p.Id == id);

    public IEnumerable<Pokemon> GetByType(PokemonType type) => _pokemons.Where(p => p.Type.Contains(type));
}
