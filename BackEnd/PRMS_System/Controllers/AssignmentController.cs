using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PRMS_System.DTO;
using PRMS_System.Models;
using PRMS_System.Services;
using System.Diagnostics;

namespace PRMS_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentController : Controller
    {
        private readonly AssignmentService _assignmentService;

        public AssignmentController(AssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentDto assignment)
        {
            await _assignmentService.AddOrUpdateAssignmentAsync(assignment);
            return Ok(new { Message = "Assignment added for all students in the class." });
        }

        [HttpPost("status")]    
        public async Task<IActionResult> UpdateAssignmentStatus([FromBody] UpdateAssignmentStatusDto updateStatusDto)
        {
            await _assignmentService.AddOrUpdateAssignmentStatusAsync(updateStatusDto.AssignmentId, updateStatusDto.StudentStatuses);
            return Ok(new { Message = "Assignment Status updated sucessfully." });
        }

        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetAssignmentsById(int assignmentId)
        {
            var assignments = await _assignmentService.GetAssignmentsByClassAsync(assignmentId);
            var assignmentList = await assignments
            .Select(s => new
                {
                    s.AssignmentId,
                    s.StudentId,
                    StudentName = $"{s.Student.FirstName} {s.Student.LastName}",
                    s.Assignment.Title,
                    s.Assignment.Description,
                    s.Assignment.DueDate,
                    s.Status,
                    s.Grade
                })
                .ToListAsync();

            return Ok(assignmentList);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetAllAssignments()
        {
            try
            {
                var assignments = await _assignmentService.GetAllAssignmentsAsync();
                return Ok(assignments);
            }
            catch (Exception)
            {
                // Log the exception (not shown here)
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }


        [HttpGet("student-summary/{studentId}")]
        public async Task<ActionResult<StudentAssignmentSummaryDto>> GetStudentAssignmentSummary(int studentId)
        {
            try
            {
                var summary = await _assignmentService.GetAssignmentSummaryForStudentAsync(studentId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("class-summary/{classId}")]
        public async Task<ActionResult<ClassAssignmentSummaryDto>> GetClassAssignmentSummary(int classId)
        {
            try
            {
                var summary = await _assignmentService.GetAssignmentSummaryForClassAsync(classId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
