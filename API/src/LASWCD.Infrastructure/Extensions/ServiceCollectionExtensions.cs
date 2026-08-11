using LASWCD.Domain.Interfaces;
using LASWCD.Infrastructure.Swapi;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LASWCD.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
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
