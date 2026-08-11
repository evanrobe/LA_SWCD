// Raw JSON shape of a SWAPI "people" resource, deserialized straight off the wire.
using System.Text.Json.Serialization;

namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiPerson
{
    public required string Name { get; set; }

    public required string Url { get; set; }

    public string? Height { get; set; }

    public string? Mass { get; set; }

    public string? Gender { get; set; }

    [JsonPropertyName("birth_year")]
    public string? BirthYear { get; set; }

    [JsonPropertyName("hair_color")]
    public string? HairColor { get; set; }

    [JsonPropertyName("eye_color")]
    public string? EyeColor { get; set; }

    [JsonPropertyName("skin_color")]
    public string? SkinColor { get; set; }

    public string? Homeworld { get; set; }

    public List<string> Species { get; set; } = [];

    public List<string> Starships { get; set; } = [];
}
