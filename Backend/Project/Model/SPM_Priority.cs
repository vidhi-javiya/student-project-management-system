using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Priority")]
    public class SPM_Priority
    {
        [Key]
        public int PriorityID { get; set; }

        public string PriorityName { get; set; } = string.Empty;

        public string PriortyCssClass { get; set; } = string.Empty;

        public virtual ICollection<SPM_Task> Tasks { get; set; } = new List<SPM_Task>();
    }
}