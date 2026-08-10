using System.Net.Http.Json;
using System.Text.Json;
using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Infrastructure.Swapi.Models;

namespace LASWCD.Infrastructure.Swapi;

public class SwapiClient(HttpClient httpClient) : ISwapiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<IEnumerable<Character>> SearchPeopleAsync(string? name, CancellationToken cancellationToken = default)
    {
        var requestUri = $"people/?name={Uri.EscapeDataString(name ?? string.Empty)}";
        var response = await httpClient.GetFromJsonAsync<SwapiSearchResponse>(requestUri, JsonOptions, cancellationToken);

        if (response?.Result is null)
        {
            return [];
        }

        return response.Result.Select(result => new Character
        {
            Id = result.Uid,
            Name = result.Properties.Name
        });
    }
}
