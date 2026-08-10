using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Managers.Interfaces;
using LASWCD.Managers.Models;

namespace LASWCD.Managers;

public class CharacterManager(ISwapiClient swapiClient) : ICharacterManager
{
    public async Task<IEnumerable<Models.Character>> SearchAsync(string? name, CancellationToken cancellationToken = default)
    {
        var people = await swapiClient.GetPeopleAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(name))
        {
            people = people.Where(person => person.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
        }

        return people
            .OrderBy(person => person.Name, StringComparer.OrdinalIgnoreCase)
            .Select(person => new Models.Character { Id = person.Id, Name = person.Name });
    }

    public async Task<CharacterDetail?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var person = await swapiClient.GetPersonAsync(id, cancellationToken);

        if (person is null)
        {
            return null;
        }

        var speciesUrl = person.SpeciesUrls.FirstOrDefault();
        var speciesTask = speciesUrl is null
            ? Task.FromResult<Species?>(null)
            : swapiClient.GetSpeciesAsync(speciesUrl, cancellationToken);
        var homeworldTask = person.HomeworldUrl is null
            ? Task.FromResult<Homeworld?>(null)
            : swapiClient.GetHomeworldAsync(person.HomeworldUrl, cancellationToken);

        await Task.WhenAll(speciesTask, homeworldTask);

        var species = speciesTask.Result;
        var homeworld = homeworldTask.Result;

        return new CharacterDetail
        {
            Id = person.Id,
            Name = person.Name,
            Attributes = new CharacterAttributes
            {
                BirthYear = person.BirthYear,
                Gender = person.Gender,
                Height = WithUnit(person.Height, "cm"),
                Mass = WithUnit(person.Mass, "kg"),
                HairColor = person.HairColor,
                EyeColor = person.EyeColor,
                SkinColor = person.SkinColor
            },
            Species = species is null
                ? null
                : new CharacterSpeciesDetail
                {
                    Name = species.Name,
                    Classification = species.Classification,
                    Designation = species.Designation,
                    AverageHeight = WithUnit(species.AverageHeight, "cm"),
                    AverageLifespan = WithUnit(species.AverageLifespan, "years"),
                    Language = species.Language
                },
            Homeworld = homeworld is null
                ? null
                : new CharacterHomeworldDetail
                {
                    Name = homeworld.Name,
                    Climate = homeworld.Climate,
                    Terrain = homeworld.Terrain,
                    Population = int.TryParse(homeworld.Population, out var population) ? population : null,
                    SurfaceWater = WithPercent(homeworld.SurfaceWater),
                    Diameter = WithFormattedUnit(homeworld.Diameter, "km"),
                    RotationPeriod = WithUnit(homeworld.RotationPeriod, "hr"),
                    OrbitalPeriod = WithUnit(homeworld.OrbitalPeriod, "d"),
                    Gravity = homeworld.Gravity
                }
        };
    }

    private static string? WithUnit(string? value, string unit) =>
        decimal.TryParse(value, out _) ? $"{value} {unit}" : value;

    private static string? WithPercent(string? value) =>
        decimal.TryParse(value, out _) ? $"{value}%" : value;

    private static string? WithFormattedUnit(string? value, string unit) =>
        decimal.TryParse(value, out var number) ? $"{number:N0} {unit}" : value;
}
