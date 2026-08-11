// Domain representation of a SWAPI species, as a character's species.
namespace LASWCD.Domain.Entities;

/// <summary>A species' raw SWAPI attributes.</summary>
public class Species
{
    public required string Name { get; set; }

    public string? Classification { get; set; }

    public string? Designation { get; set; }

    public string? AverageHeight { get; set; }

    public string? AverageLifespan { get; set; }

    public string? Language { get; set; }
}
