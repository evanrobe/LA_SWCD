namespace LASWCD.Managers.Models;

public class CharacterDetail
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public required CharacterAttributes Attributes { get; set; }

    public CharacterSpeciesDetail? Species { get; set; }

    public CharacterHomeworldDetail? Homeworld { get; set; }

    public IReadOnlyList<CharacterStarshipDetail> Starships { get; set; } = [];
}
