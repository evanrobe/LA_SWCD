using System.Net;
using System.Text;
using LASWCD.Infrastructure.Swapi;

namespace LASWCD.Infrastructure.Tests;

public class SwapiClientTests
{
    private const string PeopleJson = """
        [
          { "name": "Luke Skywalker", "url": "https://swapi.info/api/people/1" },
          { "name": "Leia Organa", "url": "https://swapi.info/api/people/5" },
          { "name": "Obi-Wan Kenobi", "url": "https://swapi.info/api/people/10" }
        ]
        """;

    [Fact]
    public async Task GetPeopleAsync_ReturnsAllPeople_MappingIdFromUrl()
    {
        var handler = new StubHttpMessageHandler(PeopleJson);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = (await client.GetPeopleAsync()).ToList();

        Assert.Equal(3, result.Count);
        Assert.Contains(result, c => c.Id == "1" && c.Name == "Luke Skywalker");
        Assert.Contains(result, c => c.Id == "5" && c.Name == "Leia Organa");
        Assert.Contains(result, c => c.Id == "10" && c.Name == "Obi-Wan Kenobi");
    }

    private class StubHttpMessageHandler(string jsonResponse) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            return Task.FromResult(response);
        }
    }
}
