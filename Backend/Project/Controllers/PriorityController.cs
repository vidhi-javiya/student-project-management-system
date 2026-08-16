using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PriorityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = await _context.SPM_Priority.ToListAsync();
            return Ok(priorities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriority(int id)
        {
            var priority = await _context.SPM_Priority.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            return Ok(priority);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePriority([FromBody] SPM_Priority priority)
        {
            _context.SPM_Priority.Add(priority);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPriority), new { id = priority.PriorityID }, priority);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePriority(int id, [FromBody] SPM_Priority priority)
        {
            if (id != priority.PriorityID)
            {
                return BadRequest("Priority ID mismatch.");
            }

            _context.Entry(priority).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PriorityExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePriority(int id)
        {
            var priority = await _context.SPM_Priority.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            _context.SPM_Priority.Remove(priority);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PriorityExists(int id)
        {
            return _context.SPM_Priority.Any(e => e.PriorityID == id);
        }
    }
}