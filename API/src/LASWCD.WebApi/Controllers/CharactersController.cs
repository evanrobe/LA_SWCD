using LASWCD.Domain.Entities;
using LASWCD.Managers.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LASWCD.WebApi.Controllers;

[ApiController]
[Route("api/v1/characters")]
public class CharactersController(ICharacterManager characterManager) : ControllerBase
{
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Character>>> Search([FromQuery] string? name, CancellationToken cancellationToken)
    {
        return Ok(await characterManager.SearchAsync(name, cancellationToken));
    }
}
