using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PRMS_System.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        public int RegistrationId { get; set; }

        [Required]
        [StringLength(255)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        public string LastName { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public DateTime EnrollmentDate { get; set; }

        public int FacultyId { get; set; }
        public Faculty Faculty { get; set; }
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public int BatchId { get; set; }
        public Batch Batch { get; set; }

        [Required]
        [StringLength(50)]
        public string GradeLevel { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Parent Parent { get; set; }
    }
}
