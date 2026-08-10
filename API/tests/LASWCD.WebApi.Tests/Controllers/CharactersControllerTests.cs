using LASWCD.Managers.Interfaces;
using LASWCD.Managers.Models;
using LASWCD.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace LASWCD.WebApi.Tests.Controllers;

public class CharactersControllerTests
{
    [Fact]
    public async Task Search_ReturnsOkWithResultsFromManager()
    {
        var expected = new[] { new Character { Id = "1", Name = "Luke Skywalker" } };
        var managerMock = new Mock<ICharacterManager>();
        managerMock.Setup(m => m.SearchAsync("luke", It.IsAny<CancellationToken>())).ReturnsAsync(expected);
        var controller = new CharactersController(managerMock.Object);

        var result = await controller.Search("luke", CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(expected, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkWithResultFromManager()
    {
        var expected = new CharacterDetail
        {
            Id = "1",
            Name = "Luke Skywalker",
            Attributes = new CharacterAttributes()
        };
        var managerMock = new Mock<ICharacterManager>();
        managerMock.Setup(m => m.GetByIdAsync("1", It.IsAny<CancellationToken>())).ReturnsAsync(expected);
        var controller = new CharactersController(managerMock.Object);

        var result = await controller.GetById("1", CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(expected, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenManagerReturnsNull()
    {
        var managerMock = new Mock<ICharacterManager>();
        managerMock.Setup(m => m.GetByIdAsync("9999", It.IsAny<CancellationToken>())).ReturnsAsync((CharacterDetail?)null);
        var controller = new CharactersController(managerMock.Object);

        var result = await controller.GetById("9999", CancellationToken.None);

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
