// Response shape for a character's basic attributes, as returned by the API.
namespace LASWCD.Managers.Models;

/// <summary>A character's display-formatted physical attributes (e.g. height with units).</summary>
public class CharacterAttributes
{
    public string? BirthYear { get; set; }

    public string? Gender { get; set; }

    public string? Height { get; set; }

    public string? Mass { get; set; }

    public string? HairColor { get; set; }

    public string? EyeColor { get; set; }

    public string? SkinColor { get; set; }
}
