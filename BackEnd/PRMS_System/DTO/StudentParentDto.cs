using PRMS_System.Models;

namespace PRMS_System.DTO
{
    public class StudentParentDto
    {
        public StudentDto Student { get; set; }
        public ParentDto Parent { get; set; }
    }

    public class StudentDto
    {
        public int RegistrationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int FacultyId { get; set; }
        public int ClassId { get; set; }
        public int BatchId { get; set; }
        public string GradeLevel { get; set; }
    }

    public class ParentDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }

    public class StudentWithParentDto
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public string FacultyName { get; set; }
        public string ClassName { get; set; }
        public string BatchName { get; set; }
        public string GradeLevel { get; set; }
        public string ParentFullName { get; set; }
        public string ParentPhoneNumber { get; set; }
        public string ParentEmail { get; set; }
    }
}
