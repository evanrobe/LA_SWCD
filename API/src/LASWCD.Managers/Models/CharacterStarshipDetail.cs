// Response shape for one of a character's starships, as returned by the API.
namespace LASWCD.Managers.Models;

/// <summary>A starship piloted by a character, display-formatted (e.g. crew/passengers parsed to numbers).</summary>
public class CharacterStarshipDetail
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public string? Classification { get; set; }

    public int? Crew { get; set; }

    public int? Passengers { get; set; }

    public string? Model { get; set; }

    public string? Manufacturer { get; set; }
}
