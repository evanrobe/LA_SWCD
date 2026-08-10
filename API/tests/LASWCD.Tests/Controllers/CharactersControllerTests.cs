using LASWCD.Domain.Entities;
using LASWCD.Managers.Interfaces;
using LASWCD.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace LASWCD.Tests.Controllers;

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
}
