// Abstraction over the SWAPI data source; implemented by LASWCD.Infrastructure, consumed by LASWCD.Managers.
using LASWCD.Domain.Entities;

namespace LASWCD.Domain.Interfaces;

/// <summary>Fetches character, species, homeworld, and starship data from SWAPI.</summary>
public interface ISwapiClient
{
    /// <summary>Gets every character.</summary>
    Task<IEnumerable<Character>> GetPeopleAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets a single character by id, or null if not found.</summary>
    Task<Character?> GetPersonAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>Gets a species by its resource URL, or null if not found.</summary>
    Task<Species?> GetSpeciesAsync(string url, CancellationToken cancellationToken = default);

    /// <summary>Gets a homeworld by its resource URL, or null if not found.</summary>
    Task<Homeworld?> GetHomeworldAsync(string url, CancellationToken cancellationToken = default);

    /// <summary>Gets a starship by its resource URL, or null if not found.</summary>
    Task<Starship?> GetStarshipAsync(string url, CancellationToken cancellationToken = default);
}
