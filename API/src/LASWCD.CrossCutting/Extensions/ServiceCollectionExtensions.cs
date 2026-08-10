using Microsoft.Extensions.DependencyInjection;

namespace LASWCD.CrossCutting.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCrossCuttingServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();

        return services;
    }
}
