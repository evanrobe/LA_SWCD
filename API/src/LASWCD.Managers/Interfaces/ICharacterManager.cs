using LASWCD.Managers.Models;

namespace LASWCD.Managers.Interfaces;

public interface ICharacterManager
{
    Task<IEnumerable<Character>> SearchAsync(string? name, CancellationToken cancellationToken = default);

    Task<CharacterDetail?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
}
