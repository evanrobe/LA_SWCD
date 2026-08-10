using LASWCD.Managers.Interfaces;
using LASWCD.Managers.Models;
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

    [HttpGet("{id}")]
    public async Task<ActionResult<CharacterDetail>> GetById(string id, CancellationToken cancellationToken)
    {
        var character = await characterManager.GetByIdAsync(id, cancellationToken);

        if (character is null)
        {
            return NotFound();
        }

        return Ok(character);
    }
}
