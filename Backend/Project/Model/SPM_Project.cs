using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Project")]
    public class SPM_Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ProjectId")]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        [Column("ProjectTitle")]
        public string ProjectTitle { get; set; } = string.Empty;

        [Column("Description")]
        public string? Description { get; set; }

        [Required]
        [Column("StudentId")]
        public int StudentId { get; set; }

        [Required]
        [Column("FacultyId")]
        public int FacultyId { get; set; }

        [Required]
        [Column("AssignedDate")]
        public DateTime AssignedDate { get; set; } = DateTime.Now;

        [Column("IsDeleted")]
        public bool? IsDeleted { get; set; }

        [Required]
        [Column("ProjectStatus")]
        public int ProjectStatus { get; set; }

        [Required]
        [Column("StartDate")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("EndDate")]
        public DateTime EndDate { get; set; }

        [Required]
        [Column("TotalTasks")]
        public int TotalTasks { get; set; }

        [Required]
        [Column("CompletedTasks")]
        public int CompletedTasks { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal ProgressPercentage { get; set; }

        // Navigation Properties

        [ForeignKey(nameof(StudentId))]
        public virtual SPM_User? Student { get; set; }

        [ForeignKey(nameof(FacultyId))]
        public virtual SPM_User? Faculty { get; set; }

        [ForeignKey(nameof(ProjectStatus))]
        public virtual SPM_Status? Status { get; set; }

        public virtual ICollection<SPM_Task> Tasks { get; set; } = new List<SPM_Task>();
    }
}