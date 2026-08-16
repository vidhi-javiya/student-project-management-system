using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Model
{
    [Table("SPM_User")]
    [Index(nameof(Email), IsUnique = true)]
    public class SPM_User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(150)")]
        [StringLength(150)]
        public string FullName { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(150)")]
        [StringLength(150)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string Password { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(15)")]
        [StringLength(15)]
        public string MobileNumber { get; set; }



        [Required]
        [Column(TypeName = "nvarchar(500)")]
        [StringLength(500)]
        public string ProfilePicturePath { get; set; }

        [Required]
        [Column(TypeName = "bit")]
        public bool IsActive { get; set; }

        [Column(TypeName = "bit")]
        public bool? IsDeleted { get; set; }

        public virtual ICollection<SPM_Project>? StudentProjects { get; set; }
        public virtual ICollection<SPM_Project>? FacultyProjects { get; set; }

        public virtual ICollection<SPM_UserRole> SPM_UserRoles { get; set; } = new List<SPM_UserRole>();
    }
}