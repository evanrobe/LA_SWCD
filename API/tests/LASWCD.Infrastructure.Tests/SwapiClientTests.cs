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

    private const string PersonJson = """
        {
          "name": "Luke Skywalker",
          "height": "172",
          "mass": "77",
          "hair_color": "blond",
          "skin_color": "fair",
          "eye_color": "blue",
          "birth_year": "19BBY",
          "gender": "male",
          "homeworld": "https://swapi.info/api/planets/1",
          "species": ["https://swapi.info/api/species/1"],
          "url": "https://swapi.info/api/people/1"
        }
        """;

    private const string SpeciesJson = """
        {
          "name": "Human",
          "classification": "mammal",
          "designation": "sentient",
          "average_height": "180",
          "average_lifespan": "120",
          "language": "Galactic Basic"
        }
        """;

    private const string PlanetJson = """
        {
          "name": "Tatooine",
          "climate": "arid",
          "terrain": "desert",
          "population": "200000",
          "surface_water": "1",
          "diameter": "10465",
          "rotation_period": "23",
          "orbital_period": "304",
          "gravity": "1 standard"
        }
        """;

    [Fact]
    public async Task GetPeopleAsync_ReturnsAllPeople_MappingIdFromUrl()
    {
        var handler = new StubHttpMessageHandler(HttpStatusCode.OK, PeopleJson);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = (await client.GetPeopleAsync()).ToList();

        Assert.Equal(3, result.Count);
        Assert.Contains(result, c => c.Id == "1" && c.Name == "Luke Skywalker");
        Assert.Contains(result, c => c.Id == "5" && c.Name == "Leia Organa");
        Assert.Contains(result, c => c.Id == "10" && c.Name == "Obi-Wan Kenobi");
    }

    [Fact]
    public async Task GetPersonAsync_ReturnsPerson_MappingIdAndAttributesFromResponse()
    {
        var handler = new StubHttpMessageHandler(HttpStatusCode.OK, PersonJson);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = await client.GetPersonAsync("1");

        Assert.NotNull(result);
        Assert.Equal("1", result.Id);
        Assert.Equal("Luke Skywalker", result.Name);
        Assert.Equal("19BBY", result.BirthYear);
        Assert.Equal("male", result.Gender);
        Assert.Equal("172", result.Height);
        Assert.Equal("77", result.Mass);
        Assert.Equal("blond", result.HairColor);
        Assert.Equal("blue", result.EyeColor);
        Assert.Equal("fair", result.SkinColor);
        Assert.Equal("https://swapi.info/api/planets/1", result.HomeworldUrl);
        Assert.Equal(["https://swapi.info/api/species/1"], result.SpeciesUrls);
    }

    [Fact]
    public async Task GetPersonAsync_ReturnsNull_WhenSwapiRespondsNotFound()
    {
        var handler = new StubHttpMessageHandler(HttpStatusCode.NotFound, string.Empty);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = await client.GetPersonAsync("9999");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetSpeciesAsync_ReturnsSpecies()
    {
        var handler = new StubHttpMessageHandler(HttpStatusCode.OK, SpeciesJson);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = await client.GetSpeciesAsync("https://swapi.info/api/species/1");

        Assert.NotNull(result);
        Assert.Equal("Human", result.Name);
        Assert.Equal("mammal", result.Classification);
        Assert.Equal("sentient", result.Designation);
        Assert.Equal("180", result.AverageHeight);
        Assert.Equal("120", result.AverageLifespan);
        Assert.Equal("Galactic Basic", result.Language);
    }

    [Fact]
    public async Task GetHomeworldAsync_ReturnsHomeworld()
    {
        var handler = new StubHttpMessageHandler(HttpStatusCode.OK, PlanetJson);
        using var httpClient = new HttpClient(handler) { BaseAddress = new Uri("https://swapi.info/api/") };
        var client = new SwapiClient(httpClient);

        var result = await client.GetHomeworldAsync("https://swapi.info/api/planets/1");

        Assert.NotNull(result);
        Assert.Equal("Tatooine", result.Name);
        Assert.Equal("arid", result.Climate);
        Assert.Equal("desert", result.Terrain);
        Assert.Equal("200000", result.Population);
        Assert.Equal("1", result.SurfaceWater);
        Assert.Equal("10465", result.Diameter);
        Assert.Equal("23", result.RotationPeriod);
        Assert.Equal("304", result.OrbitalPeriod);
        Assert.Equal("1 standard", result.Gravity);
    }

    private class StubHttpMessageHandler(HttpStatusCode statusCode, string jsonResponse) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            return Task.FromResult(response);
        }
    }
}
