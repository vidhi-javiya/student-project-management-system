using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTO
{
    public class TaskDto
    {
        public int TaskId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        public string? ProjectTitle { get; set; }

        [Required]
        [StringLength(200)]
        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        [Required]
        public int TaskStatus { get; set; }

        public string? StatusName { get; set; }

        [Required]
        public int PriorityID { get; set; }

        public string? PriorityName { get; set; }

        [Required]
        public decimal AssignedScore { get; set; }

        public decimal? EarnedScore { get; set; }

        public decimal ProgressPercentage { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [StringLength(500)]
        public string? FacultyRemarks { get; set; }

        [StringLength(500)]
        public string? StudentRemarks { get; set; }

        public bool? IsDeleted { get; set; }
    }
}