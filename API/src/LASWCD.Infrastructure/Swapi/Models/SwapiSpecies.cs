// Raw JSON shape of a SWAPI "species" resource, deserialized straight off the wire.
using System.Text.Json.Serialization;

namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiSpecies
{
    public required string Name { get; set; }

    public string? Classification { get; set; }

    public string? Designation { get; set; }

    [JsonPropertyName("average_height")]
    public string? AverageHeight { get; set; }

    [JsonPropertyName("average_lifespan")]
    public string? AverageLifespan { get; set; }

    public string? Language { get; set; }
}
