using Microsoft.EntityFrameworkCore;
using PRMS_System.DTO;
using PRMS_System.Models;

namespace PRMS_System.Services
{
    public class AssignmentService
    {
        private readonly AppDbContext _context;

        public AssignmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddOrUpdateAssignmentAsync(AssignmentDto assignmentDto)
        {
            var assignment = new Assignment
            {
                AssignmentId = assignmentDto.AssignmentId,
                Title = assignmentDto.Title,
                Description = assignmentDto.Description,
                DueDate = assignmentDto.DueDate,
                ClassId = assignmentDto.ClassId
            };

            if (assignment.AssignmentId == 0)
            {
                _context.Assignments.Add(assignment);
                await _context.SaveChangesAsync();

                assignmentDto.AssignmentId = assignment.AssignmentId;
                await AddDefaultAssignmentStatusesAsync(assignmentDto);
            }
            else
            {
               _context.Assignments.Update(assignment);
                await _context.SaveChangesAsync();
            }
            }

        private async Task AddDefaultAssignmentStatusesAsync(AssignmentDto assignmentDto)
        {
            var studentsInClass = await _context.Students
                .Where(s => s.ClassId == assignmentDto.ClassId)
                .ToListAsync();

            var assignmentStatuses = studentsInClass.Select(student => new AssignmentStatus
            {
                AssignmentId = assignmentDto.AssignmentId,
                StudentId = student.StudentId,
                Status = "Not Submitted",
                Grade = "Not Graded"
            }).ToList();

            _context.AssignmentStatuses.AddRange(assignmentStatuses);
            await _context.SaveChangesAsync();
        }

        public async Task AddOrUpdateAssignmentStatusAsync(int assignmentId, List<StudentAssignmentStatusDto> studentStatuses)
        {
            var existingStatuses = await _context.AssignmentStatuses
                .Where(s => s.AssignmentId == assignmentId)
                .ToListAsync();

            foreach (var studentStatus in studentStatuses)
            {
                var status = existingStatuses
                    .FirstOrDefault(s => s.StudentId == studentStatus.StudentId);

                if (status == null)
                {
                    status = new AssignmentStatus
                    {
                        AssignmentId = assignmentId,
                        StudentId = studentStatus.StudentId,
                        Status = studentStatus.Status,
                        Grade = studentStatus.Grade
                    };
                    _context.AssignmentStatuses.Add(status);
                }
                else
                {
                    status.Status = studentStatus.Status;
                    status.Grade = studentStatus.Grade;
                    _context.AssignmentStatuses.Update(status);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IQueryable<AssignmentStatus>> GetAssignmentsByClassAsync(int assignmentId)
        {
            return _context.AssignmentStatuses
                .Include(s => s.Assignment)
                .Include(s => s.Student)
                .Where(s => s.Assignment.AssignmentId == assignmentId);
        }

        public async Task<List<AssignmentDto>> GetAllAssignmentsAsync()
        {
            var assignments = await _context.Assignments
                .Include(a => a.Class)
                .Select(a => new AssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    Title = a.Title,
                    Description = a.Description,
                    DueDate = a.DueDate,
                    ClassId = a.ClassId,
                    ClassName = a.Class.Name
                })
                .ToListAsync();

            return assignments;
        }

        public async Task<StudentAssignmentSummaryDto> GetAssignmentSummaryForStudentAsync(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Class)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
                throw new Exception("Student not found");

            var assignmentStatuses = await _context.AssignmentStatuses
                .Where(s => s.StudentId == studentId)
                .ToListAsync();

            var totalAssignments = assignmentStatuses.Count;
            var submittedAssignments = assignmentStatuses.Count(s => s.Status == "Submitted" || s.Status == "Checked");
            var averageGrade = assignmentStatuses
                .Where(s => s.Status == "Checked" && s.Grade != "Not Graded")
                .Select(s => ConvertGradeToPercentage(s.Grade))
                .DefaultIfEmpty(0.0)
                .Average();

            return new StudentAssignmentSummaryDto
            {
                StudentId = student.StudentId,
                FullName = $"{student.FirstName} {student.LastName}",
                TotalAssignments = totalAssignments,
                SubmittedAssignments = submittedAssignments,
                AverageGrade = averageGrade
            };
        }

        private double ConvertGradeToPercentage(string grade)
        {
            return grade switch
            {
                "Pass" => 40.0,
                "Merit" => 80.0,
                "Distinction" => 100.0,
                _ => 0.0
            };
        }

        public async Task<ClassAssignmentSummaryDto> GetAssignmentSummaryForClassAsync(int classId)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.ClassId == classId);

            if (classEntity == null)
                throw new Exception("Class not found");

            var studentSummaries = new List<StudentAssignmentSummaryDto>();

            foreach (var student in classEntity.Students)
            {
                var studentSummary = await GetAssignmentSummaryForStudentAsync(student.StudentId);
                studentSummaries.Add(studentSummary);
            }

            return new ClassAssignmentSummaryDto
            {
                ClassId = classEntity.ClassId,
                ClassName = classEntity.Name,
                StudentSummaries = studentSummaries
            };
        }

    }
}
