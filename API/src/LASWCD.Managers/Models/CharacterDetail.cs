// Response shape for the character-detail endpoint, as returned by the API.
namespace LASWCD.Managers.Models;

/// <summary>A character's full composed detail view: attributes, species, homeworld, and starships.</summary>
public class CharacterDetail
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public required CharacterAttributes Attributes { get; set; }

    public CharacterSpeciesDetail? Species { get; set; }

    public CharacterHomeworldDetail? Homeworld { get; set; }

    public IReadOnlyList<CharacterStarshipDetail> Starships { get; set; } = [];
}
