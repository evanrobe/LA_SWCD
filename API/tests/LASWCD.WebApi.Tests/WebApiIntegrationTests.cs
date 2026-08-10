using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace LASWCD.WebApi.Tests;

public class WebApiIntegrationTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Get_CharactersSearch_ReturnsSuccess()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/characters/search?name=luke");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_CharactersById_ReturnsSuccess()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/characters/1");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_CharactersById_ReturnsNotFound_ForUnknownId()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/characters/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Get_SwaggerJson_ReturnsSuccess()
    {
        var client = factory.WithWebHostBuilder(builder => builder.UseEnvironment("Development")).CreateClient();

        var response = await client.GetAsync("/swagger/v1/swagger.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
