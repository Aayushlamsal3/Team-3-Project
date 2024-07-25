using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PRMS_System.Models
{
    public class AssignmentStatus
    {
        [Key]
        public int AssignmentStatusId { get; set; }

        [Required]
        public int AssignmentId { get; set; }  // Foreign key to Assignment

        [Required]
        public int StudentId { get; set; }  // Foreign key to Student

        [Required]
        public string Status { get; set; }  // e.g., "Submitted", "Not Submitted", "Checked"

        public string Grade { get; set; }  // e.g., "A", "B", "C"

        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; }
         
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
    }
}
