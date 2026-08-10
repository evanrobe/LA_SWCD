using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Managers;
using Moq;
using Xunit;

namespace LASWCD.Managers.Tests;

public class CharacterManagerTests
{
    private static readonly Character[] AllPeople =
    [
        new Character { Id = "1", Name = "Luke Skywalker" },
        new Character { Id = "5", Name = "Leia Organa" },
        new Character { Id = "11", Name = "Anakin Skywalker" },
    ];

    [Fact]
    public async Task SearchAsync_FiltersPeopleFromSwapiClientByNameCaseInsensitively()
    {
        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPeopleAsync(It.IsAny<CancellationToken>())).ReturnsAsync(AllPeople);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = (await manager.SearchAsync("skywalker")).ToList();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Id == "1" && c.Name == "Luke Skywalker");
        Assert.Contains(result, c => c.Id == "11" && c.Name == "Anakin Skywalker");
    }

    [Fact]
    public async Task SearchAsync_ReturnsFullListFromSwapiClient_WhenNameIsEmpty()
    {
        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPeopleAsync(It.IsAny<CancellationToken>())).ReturnsAsync(AllPeople);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = (await manager.SearchAsync("")).ToList();

        Assert.Equal(3, result.Count);
        Assert.Contains(result, c => c.Id == "1" && c.Name == "Luke Skywalker");
        Assert.Contains(result, c => c.Id == "5" && c.Name == "Leia Organa");
        Assert.Contains(result, c => c.Id == "11" && c.Name == "Anakin Skywalker");
    }

    [Fact]
    public async Task SearchAsync_ReturnsResultsSortedByNameCaseInsensitively()
    {
        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPeopleAsync(It.IsAny<CancellationToken>())).ReturnsAsync(AllPeople);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = (await manager.SearchAsync(null)).ToList();

        Assert.Equal(["Anakin Skywalker", "Leia Organa", "Luke Skywalker"], result.Select(c => c.Name));
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenSwapiClientReturnsNoPerson()
    {
        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPersonAsync("9999", It.IsAny<CancellationToken>())).ReturnsAsync((Character?)null);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = await manager.GetByIdAsync("9999");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_ComposesAttributesSpeciesAndHomeworld_WithUnitsAppended()
    {
        var luke = new Character
        {
            Id = "1",
            Name = "Luke Skywalker",
            BirthYear = "19BBY",
            Gender = "male",
            Height = "172",
            Mass = "77",
            HairColor = "blond",
            EyeColor = "blue",
            SkinColor = "fair",
            HomeworldUrl = "https://swapi.info/api/planets/1",
            SpeciesUrls = ["https://swapi.info/api/species/1"]
        };
        var human = new Species
        {
            Name = "Human",
            Classification = "mammal",
            Designation = "sentient",
            AverageHeight = "180",
            AverageLifespan = "120",
            Language = "Galactic Basic"
        };
        var tatooine = new Homeworld
        {
            Name = "Tatooine",
            Climate = "arid",
            Terrain = "desert",
            Population = "200000",
            SurfaceWater = "1",
            Diameter = "10465",
            RotationPeriod = "23",
            OrbitalPeriod = "304",
            Gravity = "1 standard"
        };

        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPersonAsync("1", It.IsAny<CancellationToken>())).ReturnsAsync(luke);
        swapiClientMock.Setup(c => c.GetSpeciesAsync(luke.SpeciesUrls[0], It.IsAny<CancellationToken>())).ReturnsAsync(human);
        swapiClientMock.Setup(c => c.GetHomeworldAsync(luke.HomeworldUrl!, It.IsAny<CancellationToken>())).ReturnsAsync(tatooine);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = await manager.GetByIdAsync("1");

        Assert.NotNull(result);
        Assert.Equal("1", result.Id);
        Assert.Equal("Luke Skywalker", result.Name);
        Assert.Equal("19BBY", result.Attributes.BirthYear);
        Assert.Equal("male", result.Attributes.Gender);
        Assert.Equal("172 cm", result.Attributes.Height);
        Assert.Equal("77 kg", result.Attributes.Mass);
        Assert.Equal("blond", result.Attributes.HairColor);
        Assert.Equal("blue", result.Attributes.EyeColor);
        Assert.Equal("fair", result.Attributes.SkinColor);

        Assert.NotNull(result.Species);
        Assert.Equal("Human", result.Species.Name);
        Assert.Equal("mammal", result.Species.Classification);
        Assert.Equal("sentient", result.Species.Designation);
        Assert.Equal("180 cm", result.Species.AverageHeight);
        Assert.Equal("120 years", result.Species.AverageLifespan);
        Assert.Equal("Galactic Basic", result.Species.Language);

        Assert.NotNull(result.Homeworld);
        Assert.Equal("Tatooine", result.Homeworld.Name);
        Assert.Equal("arid", result.Homeworld.Climate);
        Assert.Equal("desert", result.Homeworld.Terrain);
        Assert.Equal(200000, result.Homeworld.Population);
        Assert.Equal("1%", result.Homeworld.SurfaceWater);
        Assert.Equal("10,465 km", result.Homeworld.Diameter);
        Assert.Equal("23 hr", result.Homeworld.RotationPeriod);
        Assert.Equal("304 d", result.Homeworld.OrbitalPeriod);
        Assert.Equal("1 standard", result.Homeworld.Gravity);
    }

    [Fact]
    public async Task GetByIdAsync_LeavesSpeciesAndHomeworldNull_WhenPersonHasNoUrlsForThem()
    {
        var droid = new Character
        {
            Id = "2",
            Name = "C-3PO",
            HomeworldUrl = null,
            SpeciesUrls = []
        };

        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.GetPersonAsync("2", It.IsAny<CancellationToken>())).ReturnsAsync(droid);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = await manager.GetByIdAsync("2");

        Assert.NotNull(result);
        Assert.Null(result.Species);
        Assert.Null(result.Homeworld);
        swapiClientMock.Verify(c => c.GetSpeciesAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
        swapiClientMock.Verify(c => c.GetHomeworldAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
