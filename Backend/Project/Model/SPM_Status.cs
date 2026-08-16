using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    [Table("SPM_Status")]
    public class SPM_Status
       
        {
            [Key]
            public int StatusID { get; set; }

            [Required]
            [StringLength(20)]
            public string StatusName { get; set; }

            [Required]
            [StringLength(100)]
            public string StatusCssClass { get; set; }


        public virtual ICollection<SPM_Project>? Projects { get; set; }

        public virtual ICollection<SPM_Task> Tasks { get; set; } = new List<SPM_Task>();
    }
    }


