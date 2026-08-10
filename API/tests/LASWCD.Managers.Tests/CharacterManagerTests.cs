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
}
