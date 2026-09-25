using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.Data;
using WebApplication1.Dtos;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // 1. POST: api/Auth/login 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            var user = await _context.SPM_Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || user.Password != model.Password || !user.IsActive || user.IsDeleted == true)
            {
                return Unauthorized(new { success = false, message = "Invalid email or password." });
            }

            if (!string.IsNullOrEmpty(model.Role) &&
                !string.Equals(user.Role?.RoleName, model.Role, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { success = false, message = "Selected role does not match user account." });
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                success = true,
                token = token,
                role = user.Role?.RoleName ?? "Student",
                email = user.Email
            });
        }

        [HttpGet("login")]
        [Authorize]
        public async Task<IActionResult> TestToken()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value
                         ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { success = false, message = "Invalid token claims." });
            }

            var user = await _context.SPM_Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            return Ok(new
            {
                success = true,
                message = "Token is valid!",
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role?.RoleName
            });
        }
    }
}