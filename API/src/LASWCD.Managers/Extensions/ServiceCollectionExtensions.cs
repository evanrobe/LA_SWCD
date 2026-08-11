using LASWCD.Managers.Interfaces;
using Microsoft.Extensions.DependencyInjection;

// DI registration for the Managers (application) layer.
namespace LASWCD.Managers.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>Registers <see cref="ICharacterManager"/> and its implementation.</summary>
    public static IServiceCollection AddManagers(this IServiceCollection services)
    {
        services.AddScoped<ICharacterManager, CharacterManager>();

        return services;
    }
}
