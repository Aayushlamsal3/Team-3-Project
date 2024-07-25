using System.ComponentModel.DataAnnotations;

namespace PRMS_System.Models
{
    public class Assignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public int ClassId { get; set; }    
        public Class Class { get; set; }

        public ICollection<AssignmentStatus> AssignmentStatuses { get; set; }
    }
}
