using Microsoft.EntityFrameworkCore;
using PRMS_System.Models;
using PRMS_System.Models.CollegeSystem.Models;
using System.Security.Claims;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Parent> Parents { get; set; }

    public DbSet<Role> Roles { get; set; } // Add DbSet for Role
    public DbSet<Class> Classes { get; set; }
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Batch> Batches { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    public DbSet<Attendance> Attendances { get; set; }
    public DbSet<Assignment> Assignments { get; set; } 
    public DbSet<AssignmentStatus> AssignmentStatuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);

        modelBuilder.Entity<Student>()
            .HasOne(s => s.Faculty)
            .WithMany(f => f.Students)
            .HasForeignKey(s => s.FacultyId);

        modelBuilder.Entity<Student>()
            .HasOne(s => s.Class)
            .WithMany(c => c.Students)
            .HasForeignKey(s => s.ClassId);

        modelBuilder.Entity<Student>()
            .HasOne(s => s.Batch)
            .WithMany(b => b.Students)
            .HasForeignKey(s => s.BatchId).OnDelete(DeleteBehavior.ClientSetNull);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Parent>()
            .HasIndex(p => p.PhoneNumber)
            .IsUnique();

        modelBuilder.Entity<Parent>()
            .HasIndex(p => p.Email)
            .IsUnique();
        // No explicit foreign key constraints
        modelBuilder.Entity<Student>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull); // Manage nullability in code

        modelBuilder.Entity<Parent>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull); // Manage nullability in code

        modelBuilder.Entity<Student>()
            .HasOne(s => s.Parent)
            .WithOne(p => p.Student)
            .HasForeignKey<Parent>(p => p.StudentId);

        //modelBuilder.Entity<Parent>()
        //    .HasOne(p => p.Student)
        //    .WithMany()
        //    .HasForeignKey(p => p.StudentId)
        //    .OnDelete(DeleteBehavior.ClientSetNull); // Manage nullability in code

            modelBuilder.Entity<Account>()
                     .HasOne(a => a.User)
                     .WithOne()
                     .HasForeignKey<Account>(a => a.UserId)
                     .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Student)
                .WithMany()
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull);

        modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasColumnType("decimal(18, 2)"); // Specify precision and scale

        modelBuilder.Entity<Account>(entity =>
        {
            entity.Property(e => e.Balance)
                  .HasColumnType("decimal(18, 2)");

            entity.Property(e => e.DueAmount)
                  .HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany()
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull);

        modelBuilder.Entity<Assignment>()
                .HasMany(a => a.AssignmentStatuses)
                .WithOne(s => s.Assignment)
                .HasForeignKey(s => s.AssignmentId);

        modelBuilder.Entity<AssignmentStatus>()
            .HasOne(s => s.Student)
            .WithMany()
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }

}
