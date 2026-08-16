using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Task")]
    public class SPM_Task
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }

        [Required]
        public int ProjectId { get; set; }


        [Required]
        [StringLength(200)]
        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        [Required]
        public int TaskStatus { get; set; }

        [Required]
        public int PriorityID { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal AssignedScore { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? EarnedScore { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal ProgressPercentage { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [StringLength(500)]
        public string? FacultyRemarks { get; set; }

        [StringLength(500)]
        public string? StudentRemarks { get; set; }

        public bool? IsDeleted { get; set; }

        // Navigation Properties
      
        [ForeignKey(nameof(ProjectId))]
        public virtual SPM_Project? Project { get; set; }

        [ForeignKey(nameof(TaskStatus))]
        public virtual SPM_Status? Status { get; set; }

        [ForeignKey(nameof(PriorityID))]
        public virtual SPM_Priority? Priority { get; set; }
    }
}