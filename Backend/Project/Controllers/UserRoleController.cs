using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRoleController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRoleDto>>> GetUserRoles()
        {
            var userRoles = await _context.SPM_UserRoles
                .Include(ur => ur.Role)
                .Include(ur => ur.User)
                .Select(ur => new UserRoleDto
                {
                    RolePermissionId = ur.RolePermissionId,
                    RoleId = ur.RoleId,
                    UserId = ur.UserId,
                 
                })
                .ToListAsync();

            return Ok(userRoles);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRoleDto>> GetUserRole(int id)
        {
            var userRole = await _context.SPM_UserRoles
                .Include(ur => ur.Role)
                .Include(ur => ur.User)
                .FirstOrDefaultAsync(ur => ur.RolePermissionId == id);

            if (userRole == null)
            {
                return NotFound(new { message = "Record not found." });
            }

            var dto = new UserRoleDto
            {
                RolePermissionId = userRole.RolePermissionId,
                RoleId = userRole.RoleId,
                UserId = userRole.UserId,
               
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<UserRoleDto>> PostUserRole(UserRoleDto dto)
        {
            var roleExists = await _context.SPM_Roles.AnyAsync(r => r.RoleId == dto.RoleId);
            var userExists = await _context.SPM_Users.AnyAsync(u => u.UserId == dto.UserId);

            if (!roleExists || !userExists)
            {
                return BadRequest(new { message = "Invalid RoleId or UserId." });
            }

            var userRole = new SPM_UserRole
            {
                RoleId = dto.RoleId,
                UserId = dto.UserId
            };

            _context.SPM_UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            var result = new UserRoleDto
            {
                RolePermissionId = userRole.RolePermissionId,
                RoleId = userRole.RoleId,
                UserId = userRole.UserId
            };

            return CreatedAtAction(nameof(GetUserRole), new { id = result.RolePermissionId }, result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRole(int id, UserRoleDto dto)
        {
            if (id != dto.RolePermissionId)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            var userRole = await _context.SPM_UserRoles
                .FirstOrDefaultAsync(ur => ur.RolePermissionId == id);

            if (userRole == null)
            {
                return NotFound(new { message = "Record not found." });
            }

            var roleExists = await _context.SPM_Roles.AnyAsync(r => r.RoleId == dto.RoleId);
            var userExists = await _context.SPM_Users.AnyAsync(u => u.UserId == dto.UserId);

            if (!roleExists || !userExists)
            {
                return BadRequest(new { message = "Invalid RoleId or UserId." });
            }

            userRole.RoleId = dto.RoleId;
            userRole.UserId = dto.UserId;

            _context.Entry(userRole).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRole(int id)
        {
            var userRole = await _context.SPM_UserRoles
                .FirstOrDefaultAsync(ur => ur.RolePermissionId == id);

            if (userRole == null)
            {
                return NotFound(new { message = "Record not found." });
            }

            _context.SPM_UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}