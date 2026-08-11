using LASWCD.Managers.Interfaces;
using LASWCD.Managers.Models;
using Microsoft.AspNetCore.Mvc;

// HTTP API surface for character search and detail lookup.
namespace LASWCD.WebApi.Controllers;

/// <summary>Exposes character search and detail endpoints under /api/v1/characters.</summary>
[ApiController]
[Route("api/v1/characters")]
public class CharactersController(ICharacterManager characterManager) : ControllerBase
{
    /// <summary>GET /api/v1/characters/search?name= — characters matching an optional name filter.</summary>
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Character>>> Search([FromQuery] string? name, CancellationToken cancellationToken)
    {
        return Ok(await characterManager.SearchAsync(name, cancellationToken));
    }

    /// <summary>GET /api/v1/characters/{id} — a single character's composed detail view, or 404 if not found.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CharacterDetail>> GetById(string id, CancellationToken cancellationToken)
    {
        // Manual trigger for exercising the global exception handler end-to-end.
        if (id == "55")
        {
            throw new Exception("Test exception! You passed in Adi Gallia!");
        }

        var character = await characterManager.GetByIdAsync(id, cancellationToken);

        if (character is null)
        {
            return NotFound();
        }

        return Ok(character);
    }
}
