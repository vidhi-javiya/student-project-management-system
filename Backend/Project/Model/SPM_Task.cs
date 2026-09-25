using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    public class SPM_Task
    {
        [Key]
        public int TaskId { get; set; }

        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public virtual SPM_Project? Project { get; set; }

        public int? AssignedTo { get; set; }

        [ForeignKey("AssignedTo")]
        public virtual SPM_User? AssignedUser { get; set; }

        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        public int TaskStatus { get; set; }

        [ForeignKey("TaskStatus")]
        public virtual SPM_Status? Status { get; set; }

        public int PriorityID { get; set; }

        [ForeignKey("PriorityID")]
        public virtual SPM_Priority? Priority { get; set; }

        public decimal AssignedScore { get; set; }

        public decimal? EarnedScore { get; set; }

        public decimal? Rating { get; set; }

        public decimal ProgressPercentage { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        public string? FacultyRemarks { get; set; }

        public string? StudentRemarks { get; set; }

        public string? FileUrl { get; set; }

        public bool? IsDeleted { get; set; }
    }
}