using PRMS_System.Models;
using System.ComponentModel.DataAnnotations;

namespace PRMS_System.DTO
{
    public class AssignmentDto
    {

        public int AssignmentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int ClassId { get; set; }  // Assuming assignments are given to a class
        public string? ClassName { get; set; }

    }
}
