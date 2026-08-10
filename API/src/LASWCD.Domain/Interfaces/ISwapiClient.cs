using LASWCD.Domain.Entities;

namespace LASWCD.Domain.Interfaces;

public interface ISwapiClient
{
    Task<IEnumerable<Character>> GetPeopleAsync(CancellationToken cancellationToken = default);
}
