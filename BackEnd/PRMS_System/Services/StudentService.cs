using Microsoft.EntityFrameworkCore;
using PRMS_System.DTO;
using PRMS_System.Models;

namespace PRMS_System.Services
{
    public class StudentService
    {
        private readonly AppDbContext _context;

        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Username, string Password)> AddStudentWithParentAsync(StudentDto studentDto, ParentDto parentDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                string username = GenerateUniqueUsername(studentDto.FirstName, studentDto.LastName);
                string password = GenerateUniquePassword();
                    
                // Create User for Student and Parent
                var user = new User
                {
                    Username = username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    Email = $"{username}.@ismt.com",
                    RoleId = 2,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var student = new Student
                {
                    UserId = user.UserId,
                    RegistrationId = studentDto.RegistrationId,
                    FirstName = studentDto.FirstName,
                    LastName = studentDto.LastName,
                    DateOfBirth = studentDto.DateOfBirth,
                    EnrollmentDate = studentDto.EnrollmentDate,
                    FacultyId = studentDto.FacultyId,
                    ClassId = studentDto.ClassId,
                    BatchId = studentDto.BatchId,
                    GradeLevel = studentDto.GradeLevel,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                var parent = new Parent
                {
                    UserId = user.UserId,
                    StudentId = student.StudentId,
                    FirstName = parentDto.FirstName,
                    LastName = parentDto.LastName,
                    PhoneNumber = parentDto.PhoneNumber,
                    Email = parentDto.Email,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Parents.Add(parent);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return (true, username, password);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, null, null);
            }
        }


        public async Task<List<StudentWithParentDto>> GetAllStudentsAsync()
        {
            return await _context.Students
                .Include(s => s.Parent)
                 .Include(s => s.Faculty)
                .Include(s => s.Class)
                .Include(s => s.Batch)
                .Select(s => new StudentWithParentDto
                {
                    StudentId = s.StudentId,
                    FullName = $"{s.FirstName} {s.LastName}",
                    FacultyName = s.Faculty.Name, // Assuming you have a FacultyName property in Faculty entity
                    ClassName = s.Class.Name, // Assuming you have a ClassName property in Class entity
                    BatchName = s.Batch.Name, // Assuming you have a BatchName property in Batch entity
                    GradeLevel = s.GradeLevel,
                    ParentFullName = $"{s.Parent.FirstName} {s.Parent.LastName}",
                    ParentPhoneNumber = s.Parent.PhoneNumber,
                    ParentEmail = s.Parent.Email
                })
                .ToListAsync();
        }
       



        private string GenerateUniqueUsername(string firstName, string lastName)
        {
            string baseUsername = $"{firstName}_{lastName}".ToLower();
            string username = baseUsername;
            int counter = 1;

            while (_context.Users.Any(u => u.Username == username))
            {
                username = $"{baseUsername}{counter}";
                counter++;
            }

            return username;
        }

        private string GenerateUniquePassword()
        {
            // You can implement a more robust password generation logic if needed
            return Guid.NewGuid().ToString("N").Substring(0, 8);
        }
    }
}
