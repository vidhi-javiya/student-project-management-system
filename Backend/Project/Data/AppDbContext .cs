using Microsoft.EntityFrameworkCore;
using WebApplication1.Model;

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<SPM_User> SPM_Users { get; set; }

        public DbSet<SPM_Role> SPM_Roles { get; set; }

        public DbSet<SPM_Status> SPM_Status { get; set; }

        public DbSet<SPM_Priority> SPM_Priority { get; set; }

        public DbSet<SPM_UserRole> SPM_UserRoles { get; set; }

        public DbSet<SPM_Project> SPM_Projects { get; set; }

        public DbSet<SPM_Task> SPM_Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserRole 
            modelBuilder.Entity<SPM_UserRole>(entity =>
            {
                entity.HasKey(e => e.RolePermissionId);

                entity.HasOne(e => e.Role)
                      .WithMany()
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.SPM_UserRoles)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Project 
            modelBuilder.Entity<SPM_Project>(entity =>
            {
                entity.HasKey(e => e.ProjectId);

                entity.HasOne(e => e.Student)
                      .WithMany(u => u.StudentProjects)
                      .HasForeignKey(e => e.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Faculty)
                      .WithMany(u => u.FacultyProjects)
                      .HasForeignKey(e => e.FacultyId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Status)
                      .WithMany(s => s.Projects)
                      .HasForeignKey(e => e.ProjectStatus)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.AssignedDate)
                      .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.ProgressPercentage)
                      .HasPrecision(5, 2);
            });

            // Task 
            modelBuilder.Entity<SPM_Task>(entity =>
            {
                entity.HasOne(e => e.Project)
                       .WithMany(p => p.Tasks)
                       .HasForeignKey(e => e.ProjectId)
                       .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Status)
                      .WithMany(s => s.Tasks)
                      .HasForeignKey(e => e.TaskStatus)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Priority)
                      .WithMany(p => p.Tasks)
                      .HasForeignKey(e => e.PriorityID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.AssignedScore)
                      .HasPrecision(5, 2);

                entity.Property(e => e.EarnedScore)
                      .HasPrecision(5, 2);

                entity.Property(e => e.ProgressPercentage)
                      .HasPrecision(5, 2);
            });
        }
    }
    }