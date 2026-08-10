using LASWCD.Managers.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace LASWCD.Managers.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddManagers(this IServiceCollection services)
    {
        services.AddScoped<ICharacterManager, CharacterManager>();

        return services;
    }
}
