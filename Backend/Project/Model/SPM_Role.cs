using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Roles")]
    public class SPM_Role
    {
        [Key]
        public int RoleId { get; set; }

        public string RoleName { get; set; } = string.Empty;

        public string? Description { get; set; }

        // --- Navigation Property for SPM_User ---
        public virtual ICollection<SPM_User> Users { get; set; } = new List<SPM_User>();

        public virtual ICollection<SPM_UserRole> SPM_UserRoles { get; set; } = new List<SPM_UserRole>();
    }
}