// Response shape for a character's homeworld, as returned by the API.
namespace LASWCD.Managers.Models;

/// <summary>A character's homeworld, display-formatted (e.g. population parsed, units appended).</summary>
public class CharacterHomeworldDetail
{
    public required string Name { get; set; }

    public string? Climate { get; set; }

    public string? Terrain { get; set; }

    public int? Population { get; set; }

    public string? SurfaceWater { get; set; }

    public string? Diameter { get; set; }

    public string? RotationPeriod { get; set; }

    public string? OrbitalPeriod { get; set; }

    public string? Gravity { get; set; }
}
