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

        //Calculate Progress Percentage
        // Progress % = (EarnedScore / AssignedScore) * 100
        private static decimal CalculateProgress(decimal assignedScore, decimal? earnedScore)
        {
            if (!earnedScore.HasValue || assignedScore <= 0)
                return 0;

            decimal progress = (earnedScore.Value / assignedScore) * 100;

            return progress > 100 ? 100 : Math.Round(progress, 2);
        }

        // GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] int? projectId)
        {
            var query = _context.SPM_Tasks
                .Include(t => t.Project)
                .Include(t => t.Status)
                .Include(t => t.Priority)
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

                TaskTitle = t.TaskTitle,
                TaskDescription = t.TaskDescription,

                TaskStatus = t.TaskStatus,
                StatusName = t.Status != null ? t.Status.StatusName : null,

                PriorityID = t.PriorityID,
                PriorityName = t.Priority != null ? t.Priority.PriorityName : null,

                AssignedScore = t.AssignedScore,
                EarnedScore = t.EarnedScore,
                ProgressPercentage = t.ProgressPercentage,

                StartDate = t.StartDate,
                DueDate = t.DueDate,
                CompletedDate = t.CompletedDate,

                FacultyRemarks = t.FacultyRemarks,
                StudentRemarks = t.StudentRemarks,

                IsDeleted = t.IsDeleted
            }).ToListAsync();

            return Ok(tasks);
        }

        // 2. GET BY ID
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _context.SPM_Tasks
                .Include(t => t.Project)
                .Include(t => t.Status)
                .Include(t => t.Priority)
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

                TaskTitle = task.TaskTitle,
                TaskDescription = task.TaskDescription,

                TaskStatus = task.TaskStatus,
                StatusName = task.Status?.StatusName,

                PriorityID = task.PriorityID,
                PriorityName = task.Priority?.PriorityName,

                AssignedScore = task.AssignedScore,
                EarnedScore = task.EarnedScore,
                ProgressPercentage = task.ProgressPercentage,

                StartDate = task.StartDate,
                DueDate = task.DueDate,
                CompletedDate = task.CompletedDate,

                FacultyRemarks = task.FacultyRemarks,
                StudentRemarks = task.StudentRemarks,

                IsDeleted = task.IsDeleted
            };

            return Ok(dto);
        }

        // POST
        [HttpPost]
        public async Task<ActionResult<TaskDto>> PostTask(TaskDto dto)
        {
            // 1. Project Validation
            bool projectExists = await _context.SPM_Projects.AnyAsync(p => p.ProjectId == dto.ProjectId);
            if (!projectExists)
                return BadRequest(new { message = "Invalid ProjectId." });

            // 2. Status Validation
            bool statusExists = await _context.SPM_Status.AnyAsync(s => s.StatusID == dto.TaskStatus);
            if (!statusExists)
                return BadRequest(new { message = "Invalid Task Status." });

            // 3. Priority Validation
            bool priorityExists = await _context.SPM_Priority.AnyAsync(p => p.PriorityID == dto.PriorityID);
            if (!priorityExists)
                return BadRequest(new { message = "Invalid Priority." });

            // 4. Duplicate Task Title Validation (In Same Project)
            bool duplicateTask = await _context.SPM_Tasks.AnyAsync(t =>
                t.ProjectId == dto.ProjectId &&
                t.TaskTitle.Trim().ToLower() == dto.TaskTitle.Trim().ToLower() &&
                t.IsDeleted != true);

            if (duplicateTask)
            {
                return BadRequest(new { message = "Task Title already exists in this project." });
            }

            // 5. Automatic Progress Calculation
            decimal progress = CalculateProgress(dto.AssignedScore, dto.EarnedScore);

            var task = new SPM_Task
            {
                ProjectId = dto.ProjectId,
                TaskTitle = dto.TaskTitle.Trim(),
                TaskDescription = dto.TaskDescription,

                TaskStatus = dto.TaskStatus,
                PriorityID = dto.PriorityID,

                AssignedScore = dto.AssignedScore,
                EarnedScore = dto.EarnedScore,
                ProgressPercentage = progress,

                StartDate = dto.StartDate,
                DueDate = dto.DueDate,
                CompletedDate = dto.CompletedDate,

                FacultyRemarks = dto.FacultyRemarks,
                StudentRemarks = dto.StudentRemarks,

                IsDeleted = false
            };

            _context.SPM_Tasks.Add(task);
            await _context.SaveChangesAsync();

            dto.TaskId = task.TaskId;
            dto.ProgressPercentage = task.ProgressPercentage;
            dto.IsDeleted = false;

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, dto);
        }

        // PUT
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutTask(int id, TaskDto dto)
        {
            if (id != dto.TaskId)
            {
                return BadRequest(new { message = "Task ID mismatch." });
            }

            var task = await _context.SPM_Tasks.FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted != true);
            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            // 1. Project Validation
            bool projectExists = await _context.SPM_Projects.AnyAsync(p => p.ProjectId == dto.ProjectId);
            if (!projectExists)
                return BadRequest(new { message = "Invalid ProjectId." });

            // 2. Status Validation
            bool statusExists = await _context.SPM_Status.AnyAsync(s => s.StatusID == dto.TaskStatus);
            if (!statusExists)
                return BadRequest(new { message = "Invalid Task Status." });

            // 3. Priority Validation
            bool priorityExists = await _context.SPM_Priority.AnyAsync(p => p.PriorityID == dto.PriorityID);
            if (!priorityExists)
                return BadRequest(new { message = "Invalid Priority." });

            // 4. Check Duplicate Title if Title or Project has changed
            bool duplicateExists = await _context.SPM_Tasks.AnyAsync(t =>
                t.ProjectId == dto.ProjectId &&
                t.TaskTitle.Trim().ToLower() == dto.TaskTitle.Trim().ToLower() &&
                t.TaskId != dto.TaskId &&
                t.IsDeleted != true);

            if (duplicateExists)
            {
                return BadRequest(new { message = "Another task with this title already exists in this project." });
            }

            // Update Fields
            task.ProjectId = dto.ProjectId;
            task.TaskTitle = dto.TaskTitle.Trim();
            task.TaskDescription = dto.TaskDescription;
            task.TaskStatus = dto.TaskStatus;
            task.PriorityID = dto.PriorityID;
            task.AssignedScore = dto.AssignedScore;
            task.EarnedScore = dto.EarnedScore;

            // Recalculate progress automatically
            task.ProgressPercentage = CalculateProgress(dto.AssignedScore, dto.EarnedScore);

            task.StartDate = dto.StartDate;
            task.DueDate = dto.DueDate;
            task.CompletedDate = dto.CompletedDate;
            task.FacultyRemarks = dto.FacultyRemarks;
            task.StudentRemarks = dto.StudentRemarks;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Task updated successfully.", progressPercentage = task.ProgressPercentage });
        }

      
        // PATCH
        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int newStatusId)
        {
            var task = await _context.SPM_Tasks
                .FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted != true);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            // Validate Status
            bool statusExists = await _context.SPM_Status
                .AnyAsync(s => s.StatusID == newStatusId);

            if (!statusExists)
            {
                return BadRequest(new { message = "Invalid Task Status." });
            }

            // Update Status
            task.TaskStatus = newStatusId;

            // Completed Status (StatusID = 3)
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