public class Pokemon(int id, string name, List<PokemonType> types)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
    public List<PokemonType> Type { get; set; } = types;
}