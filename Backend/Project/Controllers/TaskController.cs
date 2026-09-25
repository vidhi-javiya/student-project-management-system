using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        private static decimal CalculateProgress(decimal assignedScore, decimal? earnedScore)
        {
            if (!earnedScore.HasValue || assignedScore <= 0)
                return 0;

            decimal progress = (earnedScore.Value / assignedScore) * 100;

            return progress > 100 ? 100 : Math.Round(progress, 2);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] int? projectId)
        {
            var query = _context.SPM_Tasks
                .Include(t => t.Project)
                .Include(t => t.Status)
                .Include(t => t.Priority)
                .Include(t => t.AssignedUser)
                .Where(t => t.IsDeleted != true);

            if (projectId.HasValue)
            {
                query = query.Where(t => t.ProjectId == projectId.Value);
            }

            var tasks = await query.Select(t => new TaskDto
            {
                TaskId = t.TaskId,
                ProjectId = t.ProjectId,
                ProjectTitle = t.Project != null ? t.Project.ProjectTitle : null,

                AssignedTo = t.AssignedTo,
                AssignedStudentName = t.AssignedUser != null ? t.AssignedUser.FullName : null,

                TaskTitle = t.TaskTitle,
                TaskDescription = t.TaskDescription,

                TaskStatus = t.TaskStatus,
                StatusName = t.Status != null ? t.Status.StatusName : null,

                PriorityID = t.PriorityID,
                PriorityName = t.Priority != null ? t.Priority.PriorityName : null,

                AssignedScore = t.AssignedScore,
                EarnedScore = t.EarnedScore,
                Rating = t.Rating,
                ProgressPercentage = t.ProgressPercentage,

                StartDate = t.StartDate,
                DueDate = t.DueDate,
                CompletedDate = t.CompletedDate,

                FacultyRemarks = t.FacultyRemarks,
                StudentRemarks = t.StudentRemarks,
                FileUrl = t.FileUrl,

                IsDeleted = t.IsDeleted
            }).ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _context.SPM_Tasks
                .Include(t => t.Project)
                .Include(t => t.Status)
                .Include(t => t.Priority)
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted != true);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            var dto = new TaskDto
            {
                TaskId = task.TaskId,
                ProjectId = task.ProjectId,
                ProjectTitle = task.Project?.ProjectTitle,

                AssignedTo = task.AssignedTo,
                AssignedStudentName = task.AssignedUser?.FullName,

                TaskTitle = task.TaskTitle,
                TaskDescription = task.TaskDescription,

                TaskStatus = task.TaskStatus,
                StatusName = task.Status?.StatusName,

                PriorityID = task.PriorityID,
                PriorityName = task.Priority?.PriorityName,

                AssignedScore = task.AssignedScore,
                EarnedScore = task.EarnedScore,
                Rating = task.Rating,
                ProgressPercentage = task.ProgressPercentage,

                StartDate = task.StartDate,
                DueDate = task.DueDate,
                CompletedDate = task.CompletedDate,

                FacultyRemarks = task.FacultyRemarks,
                StudentRemarks = task.StudentRemarks,
                FileUrl = task.FileUrl,

                IsDeleted = task.IsDeleted
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> PostTask(TaskDto dto)
        {
            bool projectExists = await _context.SPM_Projects.AnyAsync(p => p.ProjectId == dto.ProjectId);
            if (!projectExists)
                return BadRequest(new { message = "Invalid ProjectId." });

            bool statusExists = await _context.SPM_Status.AnyAsync(s => s.StatusID == dto.TaskStatus);
            if (!statusExists)
                return BadRequest(new { message = "Invalid Task Status." });

            bool priorityExists = await _context.SPM_Priority.AnyAsync(p => p.PriorityID == dto.PriorityID);
            if (!priorityExists)
                return BadRequest(new { message = "Invalid Priority." });

            if (dto.AssignedTo.HasValue)
            {
                bool userExists = await _context.SPM_Users.AnyAsync(u => u.UserId == dto.AssignedTo.Value);
                if (!userExists)
                    return BadRequest(new { message = "Invalid Assigned Student/User ID." });
            }

            bool duplicateTask = await _context.SPM_Tasks.AnyAsync(t =>
                t.ProjectId == dto.ProjectId &&
                t.TaskTitle.Trim().ToLower() == dto.TaskTitle.Trim().ToLower() &&
                t.IsDeleted != true);

            if (duplicateTask)
            {
                return BadRequest(new { message = "Task Title already exists in this project." });
            }

            decimal progress = CalculateProgress(dto.AssignedScore, dto.EarnedScore);

            var task = new SPM_Task
            {
                ProjectId = dto.ProjectId,
                AssignedTo = dto.AssignedTo,
                TaskTitle = dto.TaskTitle.Trim(),
                TaskDescription = dto.TaskDescription,

                TaskStatus = dto.TaskStatus > 0 ? dto.TaskStatus : 1,
                PriorityID = dto.PriorityID,

                AssignedScore = dto.AssignedScore,
                EarnedScore = dto.EarnedScore,
                Rating = dto.Rating,
                ProgressPercentage = progress,

                StartDate = dto.StartDate,
                DueDate = dto.DueDate,
                CompletedDate = dto.CompletedDate,

                FacultyRemarks = dto.FacultyRemarks,
                StudentRemarks = dto.StudentRemarks,
                FileUrl = dto.FileUrl,

                IsDeleted = false
            };

            _context.SPM_Tasks.Add(task);
            await _context.SaveChangesAsync();

            dto.TaskId = task.TaskId;
            dto.ProgressPercentage = task.ProgressPercentage;
            dto.IsDeleted = false;

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, dto);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutTask(int id, [FromForm] TaskDto dto, IFormFile? file)
        {
            try
            {
                if (id != dto.TaskId)
                {
                    return BadRequest(new { message = $"Task ID mismatch. Route ID: {id}, DTO ID: {dto.TaskId}" });
                }

                var task = await _context.SPM_Tasks.FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted != true);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found." });
                }

                // File Upload Logic
                if (file != null && file.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    task.FileUrl = "/uploads/" + uniqueFileName;
                }
                else if (!string.IsNullOrEmpty(dto.FileUrl))
                {
                    task.FileUrl = dto.FileUrl;
                }

                // Bulletproof dynamic status assignment to avoid Foreign Key conflicts
                var validStatus = await _context.SPM_Status.FirstOrDefaultAsync();
                if (validStatus == null)
                {
                    var defaultStatus = new SPM_Status
                    {
                        StatusID = 1,
                        StatusName = "Completed",
                        StatusCssClass = "badge bg-success"
                    };
                    _context.SPM_Status.Add(defaultStatus);
                    await _context.SaveChangesAsync();
                    task.TaskStatus = 1;
                }
                else
                {
                    task.TaskStatus = validStatus.StatusID;
                }

                // Update Fields safely
                task.ProjectId = dto.ProjectId > 0 ? dto.ProjectId : task.ProjectId;
                task.AssignedTo = dto.AssignedTo;
                task.TaskTitle = !string.IsNullOrEmpty(dto.TaskTitle) ? dto.TaskTitle.Trim() : task.TaskTitle;
                task.TaskDescription = dto.TaskDescription ?? task.TaskDescription;
                task.PriorityID = dto.PriorityID > 0 ? dto.PriorityID : task.PriorityID;
                task.AssignedScore = dto.AssignedScore;

                if (dto.Rating.HasValue)
                {
                    task.Rating = dto.Rating;
                }

                if (dto.EarnedScore.HasValue)
                {
                    task.EarnedScore = dto.EarnedScore;
                }

                task.ProgressPercentage = CalculateProgress(task.AssignedScore, task.EarnedScore);

                task.StartDate = dto.StartDate != default ? dto.StartDate : task.StartDate;
                task.DueDate = dto.DueDate != default ? dto.DueDate : task.DueDate;
                task.CompletedDate = DateTime.Now;
                task.FacultyRemarks = dto.FacultyRemarks ?? task.FacultyRemarks;
                task.StudentRemarks = dto.StudentRemarks ?? task.StudentRemarks;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Task updated successfully.", progressPercentage = task.ProgressPercentage, fileUrl = task.FileUrl });
            }
            catch (Exception ex)
            {
                var exactError = ex.InnerException?.Message ?? ex.Message;
                return BadRequest(new { message = "Server Exception: " + exactError });
            }
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int newStatusId)
        {
            var task = await _context.SPM_Tasks
                .FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted != true);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            bool statusExists = await _context.SPM_Status.AnyAsync(s => s.StatusID == newStatusId);
            if (!statusExists)
            {
                return BadRequest(new { message = "Invalid Task Status." });
            }

            task.TaskStatus = newStatusId;

            if (newStatusId == 3)
            {
                if (!task.CompletedDate.HasValue)
                {
                    task.CompletedDate = DateTime.Now;
                }
            }
            else
            {
                task.CompletedDate = null;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Task status updated successfully.",
                taskStatus = task.TaskStatus,
                completedDate = task.CompletedDate
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.SPM_Tasks.FindAsync(id);

            if (task == null || task.IsDeleted == true)
            {
                return NotFound(new { message = "Task not found." });
            }

            task.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully." });
        }
    }
}