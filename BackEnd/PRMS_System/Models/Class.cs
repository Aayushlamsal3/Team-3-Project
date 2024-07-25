namespace PRMS_System.Models
{
    public class Class
    {
        public int ClassId { get; set; }
        public string Name { get; set; }
        public ICollection<Student> Students { get; set; }

        public ICollection<Assignment> Assignments { get; set; }
    }
}
