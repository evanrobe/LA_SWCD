using LASWCD.Domain.Entities;

namespace LASWCD.Managers.Interfaces;

public interface ICharacterManager
{
    Task<IEnumerable<Character>> SearchAsync(string? name, CancellationToken cancellationToken = default);
}
