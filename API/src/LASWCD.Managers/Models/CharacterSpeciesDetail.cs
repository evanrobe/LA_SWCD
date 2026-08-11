// Response shape for a character's species, as returned by the API.
namespace LASWCD.Managers.Models;

/// <summary>A character's species, display-formatted (e.g. units appended to numeric fields).</summary>
public class CharacterSpeciesDetail
{
    public required string Name { get; set; }

    public string? Classification { get; set; }

    public string? Designation { get; set; }

    public string? AverageHeight { get; set; }

    public string? AverageLifespan { get; set; }

    public string? Language { get; set; }
}
