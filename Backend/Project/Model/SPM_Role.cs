using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Roles")]
    public class SPM_Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; }

        [StringLength(250)]
        public string? Description { get; set; }
        public virtual ICollection<SPM_UserRole> SPM_UserRoles { get; set; } = new List<SPM_UserRole>();
    }
}