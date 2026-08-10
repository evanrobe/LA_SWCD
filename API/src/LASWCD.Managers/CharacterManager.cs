using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Managers.Interfaces;

namespace LASWCD.Managers;

public class CharacterManager(ISwapiClient swapiClient) : ICharacterManager
{
    public async Task<IEnumerable<Character>> SearchAsync(string? name, CancellationToken cancellationToken = default)
    {
        var people = await swapiClient.GetPeopleAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(name))
        {
            return people;
        }

        return people.Where(person => person.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
    }
}
