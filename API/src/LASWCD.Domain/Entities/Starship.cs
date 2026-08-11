// Domain representation of a SWAPI starship piloted by a character.
namespace LASWCD.Domain.Entities;

/// <summary>A starship's raw SWAPI attributes.</summary>
public class Starship
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public string? Classification { get; set; }

    public string? Crew { get; set; }

    public string? Passengers { get; set; }

    public string? Model { get; set; }

    public string? Manufacturer { get; set; }
}
