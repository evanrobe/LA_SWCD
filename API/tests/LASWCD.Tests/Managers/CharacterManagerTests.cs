using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Managers;
using Moq;
using Xunit;

namespace LASWCD.Tests.Managers;

public class CharacterManagerTests
{
    [Fact]
    public async Task SearchAsync_ReturnsResultsFromSwapiClient()
    {
        var expected = new[] { new Character { Id = "1", Name = "Luke Skywalker" } };
        var swapiClientMock = new Mock<ISwapiClient>();
        swapiClientMock.Setup(c => c.SearchPeopleAsync("luke", It.IsAny<CancellationToken>())).ReturnsAsync(expected);
        var manager = new CharacterManager(swapiClientMock.Object);

        var result = await manager.SearchAsync("luke");

        Assert.Same(expected, result);
    }
}
