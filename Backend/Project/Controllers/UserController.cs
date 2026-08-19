using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment; 

        public UserController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment; 
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.SPM_Users
                .Where(u => u.IsDeleted != true)
                .ToListAsync();

            return Ok(users);
        }

        // GET USER BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.SPM_Users.FindAsync(id);

            if (user == null || user.IsDeleted == true)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // ADD USER WITH FILE UPLOAD
        [HttpPost]
        public async Task<IActionResult> AddUser(
    [FromForm] string fullName,
    [FromForm] string email,
    [FromForm] string password,
    [FromForm] string mobileNumber,
    [FromForm] bool isActive,
    IFormFile profilePicture)
        {
            try
            {
                if (await _context.SPM_Users.AnyAsync(u => u.Email == email))
                {
                    return BadRequest("Already Email Register....");
                }

                string wwwRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                if (!Directory.Exists(wwwRootPath))
                {
                    Directory.CreateDirectory(wwwRootPath);
                }

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(profilePicture.FileName);
                string filePath = Path.Combine(wwwRootPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePicture.CopyToAsync(stream);
                }

                var newUser = new SPM_User
                {
                    FullName = fullName,
                    Email = email,
                    Password = password,
                    MobileNumber = mobileNumber,
                    IsActive = isActive,
                    ProfilePicturePath = fileName,
            
                };

                _context.SPM_Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        // UPDATE USER WITH FILE UPLOAD
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
     int id,
     [FromForm] string fullName,
     [FromForm] string email,
     [FromForm] string? password,
     [FromForm] string mobileNumber,
     [FromForm] bool isActive,
     IFormFile? profilePicture)
        {
            var existingUser = await _context.SPM_Users.FindAsync(id);

            if (existingUser == null)
            {
                return NotFound("Not Found !.");
            }

            if (await _context.SPM_Users.AnyAsync(u => u.Email == email && u.UserId != id))
            {
                return BadRequest("All ready this email register by another user");
            }

            existingUser.FullName = fullName;
            existingUser.Email = email;
            existingUser.MobileNumber = mobileNumber;
            existingUser.IsActive = isActive;

            if (!string.IsNullOrWhiteSpace(password))
            {
                existingUser.Password = password;
            }

            if (profilePicture != null && profilePicture.Length > 0)
            {
                string wwwRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                if (!Directory.Exists(wwwRootPath))
                {
                    Directory.CreateDirectory(wwwRootPath);
                }

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(profilePicture.FileName);
                string filePath = Path.Combine(wwwRootPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePicture.CopyToAsync(stream);
                }

                existingUser.ProfilePicturePath = fileName;
            }

            await _context.SaveChangesAsync();

            return Ok(existingUser);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.SPM_Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.IsDeleted = true;

            await _context.SaveChangesAsync();

            return Ok("User Deleted Successfully");
        }
    }
}