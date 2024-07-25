namespace PRMS_System.DTO
{
    public class StudentAssignmentSummaryDto
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public int TotalAssignments { get; set; }
        public int SubmittedAssignments { get; set; }
        public double AverageGrade { get; set; }
    }

    public class ClassAssignmentSummaryDto
    {
        public int ClassId { get; set; }
        public string ClassName { get; set; }
        public List<StudentAssignmentSummaryDto> StudentSummaries { get; set; }
    }
}
