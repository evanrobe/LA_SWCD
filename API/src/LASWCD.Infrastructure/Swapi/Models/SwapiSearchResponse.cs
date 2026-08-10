namespace LASWCD.Infrastructure.Swapi.Models;

internal class SwapiSearchResponse
{
    public string? Message { get; set; }

    public List<SwapiPersonResult>? Result { get; set; }
}
