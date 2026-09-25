using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Status")]
    public class SPM_Status
    {
        [Key]
        public int StatusID { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public string StatusCssClass { get; set; } = string.Empty;

        public virtual ICollection<SPM_Project>? Projects { get; set; }

        public virtual ICollection<SPM_Task> Tasks { get; set; } = new List<SPM_Task>();
    }
}