using System.Net.Http.Json;
using System.Text.Json;
using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Infrastructure.Swapi.Models;

namespace LASWCD.Infrastructure.Swapi;

// swapi.info serves a static, unfiltered dump per resource; there is no query-param search support.
public class SwapiClient(HttpClient httpClient) : ISwapiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<IEnumerable<Character>> GetPeopleAsync(CancellationToken cancellationToken = default)
    {
        var people = await httpClient.GetFromJsonAsync<List<SwapiPerson>>("people/", JsonOptions, cancellationToken);

        if (people is null)
        {
            return [];
        }

        return people.Select(person => new Character
        {
            Id = person.Url.TrimEnd('/').Split('/').Last(),
            Name = person.Name
        });
    }
}
