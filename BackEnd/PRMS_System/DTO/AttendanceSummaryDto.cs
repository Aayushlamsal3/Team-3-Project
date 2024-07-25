namespace PRMS_System.DTO
{
    public class AttendanceSummaryDto
    {
        public int StudentId { get; set; }
        public int TotalClasses { get; set; }
        public int AttendedDays { get; set; }
        public double AttendancePercentage { get; set; }
    }
    public class ClassAttendanceSummaryDto
    {
        public int ClassId { get; set; }
        public int BatchId { get; set; }
        public List<AttendanceSummaryDto> StudentSummaries { get; set; }
    }
}
