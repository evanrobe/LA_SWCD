// Raw JSON shape of a SWAPI "starships" resource, deserialized straight off the wire.
using System.Text.Json.Serialization;

namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiStarship
{
    public required string Name { get; set; }

    public required string Url { get; set; }

    [JsonPropertyName("starship_class")]
    public string? StarshipClass { get; set; }

    public string? Crew { get; set; }

    public string? Passengers { get; set; }

    public string? Model { get; set; }

    public string? Manufacturer { get; set; }
}
