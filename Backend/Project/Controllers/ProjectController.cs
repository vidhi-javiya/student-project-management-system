using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectController(AppDbContext context)
        {
            _context = context;
        }

     
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _context.SPM_Projects
                .Include(p => p.Student)
                .Include(p => p.Faculty)
                .Include(p => p.Status)
                .Select(p => new ProjectDto
                {
                    ProjectId = p.ProjectId,
                    ProjectTitle = p.ProjectTitle,
                    Description = p.Description,
                    StudentId = p.StudentId,
                    FacultyId = p.FacultyId,
                    AssignedDate = p.AssignedDate,
                    IsDeleted = p.IsDeleted,
                    ProjectStatus = p.ProjectStatus,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    TotalTasks = p.TotalTasks,
                    CompletedTasks = p.CompletedTasks,
                    ProgressPercentage = p.ProgressPercentage,

                    StudentName = p.Student != null ? p.Student.FullName : null,
                    FacultyName = p.Faculty != null ? p.Faculty.FullName : null,
                    StatusName = p.Status != null ? p.Status.StatusName : null
                })
                .ToListAsync();

            return Ok(projects);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var project = await _context.SPM_Projects
                .Include(p => p.Student)
                .Include(p => p.Faculty)
                .Include(p => p.Status)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null)
            {
                return NotFound(new { message = "Project not found." });
            }

            var dto = new ProjectDto
            {
                ProjectId = project.ProjectId,
                ProjectTitle = project.ProjectTitle,
                Description = project.Description,
                StudentId = project.StudentId,
                FacultyId = project.FacultyId,
                AssignedDate = project.AssignedDate,
                IsDeleted = project.IsDeleted,
                ProjectStatus = project.ProjectStatus,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                TotalTasks = project.TotalTasks,
                CompletedTasks = project.CompletedTasks,
                ProgressPercentage = project.ProgressPercentage,

                StudentName = project.Student != null ? project.Student.FullName : null,
                FacultyName = project.Faculty != null ? project.Faculty.FullName : null,
                StatusName = project.Status != null ? project.Status.StatusName : null
            };

            return Ok(dto);
        }

       
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> PostProject(ProjectDto dto)
        {
            //  Duplicate Project Title Check 
            bool isDuplicate = await _context.SPM_Projects
                .AnyAsync(x => x.ProjectTitle.ToLower() == dto.ProjectTitle.ToLower()
                            && x.IsDeleted != true);

            if (isDuplicate)
            {
                return BadRequest(new { message = "A project with this title already exists." });
            }

           
            bool studentExists = await _context.SPM_Users
                .AnyAsync(x => x.UserId == dto.StudentId);

            bool facultyExists = await _context.SPM_Users
                .AnyAsync(x => x.UserId == dto.FacultyId);

            bool statusExists = await _context.SPM_Status
                .AnyAsync(x => x.StatusID == dto.ProjectStatus);

            if (!studentExists)
                return BadRequest(new { message = "Invalid StudentId." });

            if (!facultyExists)
                return BadRequest(new { message = "Invalid FacultyId." });

            if (!statusExists)
                return BadRequest(new { message = "Invalid ProjectStatus." });

            var project = new SPM_Project
            {
                ProjectTitle = dto.ProjectTitle,
                Description = dto.Description,
                StudentId = dto.StudentId,
                FacultyId = dto.FacultyId,
                AssignedDate = dto.AssignedDate,
                IsDeleted = dto.IsDeleted,
                ProjectStatus = dto.ProjectStatus,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                TotalTasks = dto.TotalTasks,
                CompletedTasks = dto.CompletedTasks,
                ProgressPercentage = dto.ProgressPercentage
            };

            _context.SPM_Projects.Add(project);
            await _context.SaveChangesAsync();

            dto.ProjectId = project.ProjectId;

            return CreatedAtAction(nameof(GetProject),
                new { id = project.ProjectId }, dto);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, ProjectDto dto)
        {
            if (id != dto.ProjectId)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            var project = await _context.SPM_Projects
                .FirstOrDefaultAsync(x => x.ProjectId == id);

            if (project == null)
            {
                return NotFound(new { message = "Project not found." });
            }

            // Duplicate Title Check
            bool isDuplicate = await _context.SPM_Projects
                .AnyAsync(x => x.ProjectTitle.ToLower() == dto.ProjectTitle.ToLower()
                            && x.ProjectId != id
                            && x.IsDeleted != true);

            if (isDuplicate)
            {
                return BadRequest(new { message = "Another project with this title already exists." });
            }

           
            bool studentExists = await _context.SPM_Users
                .AnyAsync(x => x.UserId == dto.StudentId);

            bool facultyExists = await _context.SPM_Users
                .AnyAsync(x => x.UserId == dto.FacultyId);

            bool statusExists = await _context.SPM_Status
                .AnyAsync(x => x.StatusID == dto.ProjectStatus);

            if (!studentExists)
                return BadRequest(new { message = "Invalid StudentId." });

            if (!facultyExists)
                return BadRequest(new { message = "Invalid FacultyId." });

            if (!statusExists)
                return BadRequest(new { message = "Invalid ProjectStatus." });

        
            project.ProjectTitle = dto.ProjectTitle;
            project.Description = dto.Description;
            project.StudentId = dto.StudentId;
            project.FacultyId = dto.FacultyId;
            project.AssignedDate = dto.AssignedDate;
            project.IsDeleted = dto.IsDeleted;
            project.ProjectStatus = dto.ProjectStatus;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;
            project.TotalTasks = dto.TotalTasks;
            project.CompletedTasks = dto.CompletedTasks;
            project.ProgressPercentage = dto.ProgressPercentage;

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.SPM_Projects
                .FirstOrDefaultAsync(x => x.ProjectId == id);

            if (project == null)
            {
                return NotFound(new { message = "Project not found." });
            }

            _context.SPM_Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}