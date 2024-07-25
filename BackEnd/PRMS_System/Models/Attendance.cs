using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PRMS_System.Models
{
    public class Attendance
    {
        [Key]
        public int AttendanceId { get; set; }

        [Required]
        public int StudentId { get; set; }  // Foreign key to Student

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string? Status { get; set; }  // e.g., "Present", "Absent", "Late"

        [ForeignKey("StudentId")]
        public Student Student { get; set; }
    }
}
