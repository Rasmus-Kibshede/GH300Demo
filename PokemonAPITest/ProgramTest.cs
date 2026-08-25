namespace PokemonAPITest;

public class ProgramTest
{
    private IPokemonService _service = null!;

    [SetUp]
    public void Setup()
    {
        _service = new PokemonService();
    }

    [Test]
    public void GetAll_ShouldReturnAllPokemons()
    {
        var result = _service.GetAll().ToList();

        Assert.That(result, Has.Count.EqualTo(10));
        Assert.That(result.Select(p => p.Id), Is.EquivalentTo(Enumerable.Range(1, 10)));
    }

    [Test]
    public void GetById_WhenIdExists_ShouldReturnPokemon()
    {
        var result = _service.GetById(4);

        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Name, Is.EqualTo("Charmander"));
            Assert.That(result.Type, Is.EquivalentTo(new[] { PokemonType.Fire }));
        });
    }

    [Test]
    public void GetById_WhenIdDoesNotExist_ShouldReturnNull()
    {
        var result = _service.GetById(999);

        Assert.That(result, Is.Null);
    }

    [Test]
    public void GetByType_WhenTypeIsFire_ShouldReturnExpectedPokemons()
    {
        var result = _service.GetByType(PokemonType.Fire).ToList();

        Assert.That(result.Select(p => p.Name),
            Is.EquivalentTo(new[] { "Charmander", "Charmeleon", "Charizard" }));
    }

    [Test]
    public void GetByType_WhenPokemonHasMultipleTypes_ShouldIncludeThatPokemon()
    {
        var result = _service.GetByType(PokemonType.Flying).ToList();

        Assert.That(result, Has.Count.EqualTo(1));
        Assert.That(result[0].Name, Is.EqualTo("Charizard"));
    }

    [Test]
    public void GetByType_WhenNoPokemonMatches_ShouldReturnEmpty()
    {
        var result = _service.GetByType((PokemonType)int.MaxValue);

        Assert.That(result, Is.Empty);
    }
}
