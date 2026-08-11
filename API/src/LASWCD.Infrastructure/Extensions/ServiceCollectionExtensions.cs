// DI registration for the Infrastructure layer: wires ISwapiClient to its HTTP-backed implementation.
using LASWCD.Domain.Interfaces;
using LASWCD.Infrastructure.Swapi;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LASWCD.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>Registers <see cref="ISwapiClient"/> with a resilient (retrying) HttpClient pointed at the configured SWAPI base URL.</summary>
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var swapiBaseUrl = configuration["Swapi:BaseUrl"] ?? "https://swapi.info/api/";

        services.AddHttpClient<ISwapiClient, SwapiClient>(client =>
        {
            client.BaseAddress = new Uri(swapiBaseUrl);
        }).AddStandardResilienceHandler();

        return services;
    }
}
