namespace LASWCD.Managers.Models;

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
