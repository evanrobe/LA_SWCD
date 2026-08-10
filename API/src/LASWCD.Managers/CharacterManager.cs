using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Managers.Interfaces;

namespace LASWCD.Managers;

public class CharacterManager(ISwapiClient swapiClient) : ICharacterManager
{
    public Task<IEnumerable<Character>> SearchAsync(string? name, CancellationToken cancellationToken = default)
    {
        return swapiClient.SearchPeopleAsync(name, cancellationToken);
    }
}
