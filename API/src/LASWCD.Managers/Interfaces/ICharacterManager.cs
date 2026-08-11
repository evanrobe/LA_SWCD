using LASWCD.Managers.Models;

// Abstraction over character search/detail use cases; implemented by LASWCD.Managers, consumed by LASWCD.WebApi.
namespace LASWCD.Managers.Interfaces;

/// <summary>Searches characters and builds their composed detail view.</summary>
public interface ICharacterManager
{
    /// <summary>Gets characters matching an optional name filter, sorted by name.</summary>
    Task<IEnumerable<Character>> SearchAsync(string? name, CancellationToken cancellationToken = default);

    /// <summary>Gets the composed detail view for a character by id, or null if not found.</summary>
    Task<CharacterDetail?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
}
