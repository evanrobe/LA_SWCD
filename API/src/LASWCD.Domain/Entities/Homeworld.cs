namespace LASWCD.Domain.Entities;

public class Homeworld
{
    public required string Name { get; set; }

    public string? Climate { get; set; }

    public string? Terrain { get; set; }

    public string? Population { get; set; }
}
