namespace LASWCD.Domain.Entities;

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
