using LASWCD.Domain.Entities;

namespace LASWCD.Domain.Interfaces;

public interface ISwapiClient
{
    Task<IEnumerable<Character>> SearchPeopleAsync(string? name, CancellationToken cancellationToken = default);
}
