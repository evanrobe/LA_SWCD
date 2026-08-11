// Domain representation of a SWAPI character, including raw attribute strings and related-resource URLs.
namespace LASWCD.Domain.Entities;

/// <summary>A Star Wars character and its raw SWAPI attributes.</summary>
public class Character
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public string? BirthYear { get; set; }

    public string? Gender { get; set; }

    public string? Height { get; set; }

    public string? Mass { get; set; }

    public string? HairColor { get; set; }

    public string? EyeColor { get; set; }

    public string? SkinColor { get; set; }

    public string? HomeworldUrl { get; set; }

    public IReadOnlyList<string> SpeciesUrls { get; set; } = [];

    public IReadOnlyList<string> StarshipUrls { get; set; } = [];
}
