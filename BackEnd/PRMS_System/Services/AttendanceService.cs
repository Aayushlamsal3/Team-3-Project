using Microsoft.EntityFrameworkCore;
using PRMS_System.DTO;
using PRMS_System.Models;

namespace PRMS_System.Services
{
    public class AttendanceService
    {
        private readonly AppDbContext _context;

        public AttendanceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddOrUpdateAttendanceAsync(int studentId, DateTime date, string status)
        {
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.Date == date);

            if (attendance == null)
            {
                attendance = new Attendance
                {
                    StudentId = studentId,
                    Date = date,
                    Status = status
                };
                _context.Attendances.Add(attendance);
            }
            else
            {
                attendance.Status = status;
                _context.Attendances.Update(attendance);
            }

            await _context.SaveChangesAsync();
        }

        public async Task AddOrUpdateBulkAttendanceAsync(BulkAttendanceDto bulkAttendanceDto)
        {
            var attendances = await _context.Attendances
                .Where(a => bulkAttendanceDto.Attendances.Select(att => att.StudentId).Contains(a.StudentId)
                            && a.Date == bulkAttendanceDto.Date)
                .ToListAsync();

            foreach (var studentAttendance in bulkAttendanceDto.Attendances)
            {
                var attendance = attendances
                    .FirstOrDefault(a => a.StudentId == studentAttendance.StudentId);

                if (attendance == null)
                {
                    attendance = new Attendance
                    {
                        StudentId = studentAttendance.StudentId,
                        Date = bulkAttendanceDto.Date,
                        Status = studentAttendance.Status
                    };
                    _context.Attendances.Add(attendance);
                }
                else
                {
                    attendance.Status = studentAttendance.Status;
                    _context.Attendances.Update(attendance);
                }
            }

            await _context.SaveChangesAsync();
        }

        //public async Task<IQueryable<Attendance>> GetAttendancesByClassAsync(int classId, int batchId, DateTime date)
        //{
        //    // Assuming you have a way to filter students by class, section, and batch
        //    var studentIds = await _context.Students
        //        .Where(s => s.ClassId == classId && s.BatchId == batchId)
        //        .Select(s => s.StudentId)
        //        .ToListAsync();

        //    return _context.Attendances
        //        .Where(a => studentIds.Contains(a.StudentId) && a.Date.Date == date.Date)
        //        .Include(a => a.Student);
        //}

        public async Task<List<Attendance>> GetAttendancesByClassAsync(int classId, int batchId, DateTime date)
        {
            var studentIds = await _context.Students
                .Where(s => s.ClassId == classId && s.BatchId == batchId)
                .Select(s => s.StudentId)
                .ToListAsync();

            if (date.Date > DateTime.Now.Date)
            {
                var futureAttendances = studentIds
                    .Select(id => new Attendance
                    {
                        StudentId = id,
                        Date = date,
                        Status = null,
                        Student = _context.Students.FirstOrDefault(s => s.StudentId == id)
                    })
                    .ToList();

                return futureAttendances;
            }

            var attendances = await _context.Attendances
                .Where(a => studentIds.Contains(a.StudentId) && a.Date.Date == date.Date)
                .Include(a => a.Student)
                .ToListAsync();

            if (!attendances.Any())
            {
                var emptyAttendances = studentIds
                    .Select(id => new Attendance
                    {
                        StudentId = id,
                        Date = date,
                        Status = null,
                        Student = _context.Students.FirstOrDefault(s => s.StudentId == id)
                    })
                    .ToList();

                return emptyAttendances;
            }

            return attendances;
        }

        public async Task<AttendanceSummaryDto> GetStudentAttendanceSummaryAsync(int studentId, DateTime? startDate = null, DateTime? endDate = null)
        {
            startDate ??= new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            endDate ??= DateTime.Now;

            var totalClasses = await _context.Attendances
                .Where(a => a.Date >= startDate && a.Date <= endDate)
                .Select(a => a.Date)
                .Distinct()
                .CountAsync();

            var attendedDays = await _context.Attendances
                .Where(a => a.StudentId == studentId && a.Status == "Present" && a.Date >= startDate && a.Date <= endDate)
                .CountAsync();

            var attendancePercentage = totalClasses > 0 ? (double)attendedDays / totalClasses * 100 : 0;

            return new AttendanceSummaryDto
            {
                StudentId = studentId,
                TotalClasses = totalClasses,
                AttendedDays = attendedDays,
                AttendancePercentage = attendancePercentage
            };
        }

        public async Task<ClassAttendanceSummaryDto> GetClassAttendanceSummaryAsync(int classId, int batchId, DateTime? startDate = null, DateTime? endDate = null)
        {
            startDate ??= new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            endDate ??= DateTime.Now;

            var studentIds = await _context.Students
                .Where(s => s.ClassId == classId && s.BatchId == batchId)
                .Select(s => s.StudentId)
                .ToListAsync();

            var studentSummaries = new List<AttendanceSummaryDto>();

            foreach (var studentId in studentIds)
            {
                var studentSummary = await GetStudentAttendanceSummaryAsync(studentId, startDate, endDate);
                studentSummaries.Add(studentSummary);
            }

            return new ClassAttendanceSummaryDto
            {
                ClassId = classId,
                BatchId = batchId,
                StudentSummaries = studentSummaries
            };
        }
    }
}
