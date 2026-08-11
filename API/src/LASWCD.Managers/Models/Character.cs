// Response shape for a character search result, as returned by the API. Distinct from
// LASWCD.Domain.Entities.Character, which carries the raw SWAPI attributes internally.
namespace LASWCD.Managers.Models;

/// <summary>A character's id and name, as returned by search.</summary>
public class Character
{
    public required string Id { get; set; }

    public required string Name { get; set; }
}
