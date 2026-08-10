using LASWCD.Domain.Entities;

namespace LASWCD.Domain.Interfaces;

public interface ISwapiClient
{
    Task<IEnumerable<Character>> GetPeopleAsync(CancellationToken cancellationToken = default);

    Task<Character?> GetPersonAsync(string id, CancellationToken cancellationToken = default);

    Task<Species?> GetSpeciesAsync(string url, CancellationToken cancellationToken = default);

    Task<Homeworld?> GetHomeworldAsync(string url, CancellationToken cancellationToken = default);
}
