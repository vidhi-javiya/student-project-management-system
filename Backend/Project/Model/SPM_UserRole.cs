using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_UserRole")]
    public class SPM_UserRole
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("RolePermissionId")]
        public int RolePermissionId { get; set; }

        [Required]
        [Column("RoleId")]
        public int RoleId { get; set; }

        [Required]
        [Column("UserId")]
        public int UserId { get; set; }

        
        [ForeignKey(nameof(RoleId))]
        public virtual SPM_Role? Role { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual SPM_User? User { get; set; }
    }
}