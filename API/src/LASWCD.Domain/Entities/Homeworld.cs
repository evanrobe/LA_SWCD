// Domain representation of a SWAPI planet, as a character's homeworld.
namespace LASWCD.Domain.Entities;

/// <summary>A planet's raw SWAPI attributes.</summary>
public class Homeworld
{
    public required string Name { get; set; }

    public string? Climate { get; set; }

    public string? Terrain { get; set; }

    public string? Population { get; set; }

    public string? SurfaceWater { get; set; }

    public string? Diameter { get; set; }

    public string? RotationPeriod { get; set; }

    public string? OrbitalPeriod { get; set; }

    public string? Gravity { get; set; }
}
