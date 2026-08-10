using System.Text.Json.Serialization;

namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiPlanet
{
    public required string Name { get; set; }

    public string? Climate { get; set; }

    public string? Terrain { get; set; }

    public string? Population { get; set; }

    [JsonPropertyName("surface_water")]
    public string? SurfaceWater { get; set; }

    public string? Diameter { get; set; }

    [JsonPropertyName("rotation_period")]
    public string? RotationPeriod { get; set; }

    [JsonPropertyName("orbital_period")]
    public string? OrbitalPeriod { get; set; }

    public string? Gravity { get; set; }
}
