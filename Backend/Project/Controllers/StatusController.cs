using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _context.SPM_Status.ToListAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var status = await _context.SPM_Status.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            return Ok(status);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus([FromBody] SPM_Status status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SPM_Status.Add(status);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStatus), new { id = status.StatusID }, status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] SPM_Status status)
        {
            if (id != status.StatusID)
            {
                return BadRequest("Status ID mismatch.");
            }

            _context.Entry(status).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatusExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var status = await _context.SPM_Status.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            _context.SPM_Status.Remove(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StatusExists(int id)
        {
            return _context.SPM_Status.Any(e => e.StatusID == id);
        }
    }
}