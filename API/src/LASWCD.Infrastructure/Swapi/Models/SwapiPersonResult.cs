namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiPersonResult
{
    public required string Uid { get; set; }

    public required SwapiPersonProperties Properties { get; set; }
}
