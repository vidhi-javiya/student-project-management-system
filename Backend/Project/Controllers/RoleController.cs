using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<SPM_Role> _validator;

        public RoleController(AppDbContext context, IValidator<SPM_Role> validator)
        {
            _context = context;
            _validator = validator;
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.SPM_Roles.ToListAsync();
            return Ok(roles);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.SPM_Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound(new { message = "Role not found." });
            }

            return Ok(role);
        }

        // INSERT (POST)
        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] SPM_Role role)
        {
            // Validate using FluentValidation
            var validationResult = await _validator.ValidateAsync(role);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new
                {
                    success = false,
                    errors = errors
                });
            }

            _context.SPM_Roles.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, role);
        }

        // UPDATE (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] SPM_Role role)
        {
            if (id != role.RoleId)
            {
                return BadRequest(new { message = "RoleId mismatch." });
            }

            // Validate using FluentValidation
            var validationResult = await _validator.ValidateAsync(role);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new
                {
                    success = false,
                    errors = errors
                });
            }

            var existingRole = await _context.SPM_Roles.FindAsync(id);

            if (existingRole == null)
            {
                return NotFound(new { message = "Role not found." });
            }

            existingRole.RoleName = role.RoleName;
            existingRole.Description = role.Description;

            await _context.SaveChangesAsync();

            return Ok(existingRole);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.SPM_Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound(new { message = "Role not found." });
            }

            _context.SPM_Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Role Deleted Successfully" });
        }
    }
}