using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_TaskValidator : AbstractValidator<SPM_Task>
    {
        public SPM_TaskValidator()
        {
            RuleFor(x => x.ProjectId)
                .GreaterThan(0).WithMessage("Project ID is required.");

            RuleFor(x => x.TaskTitle)
                .NotEmpty().WithMessage("Task Title is required.")
                .MaximumLength(200).WithMessage("Task Title cannot exceed 200 characters.");

            RuleFor(x => x.TaskStatus)
                .GreaterThan(0).WithMessage("Task Status is required.");

            RuleFor(x => x.PriorityID)
                .GreaterThan(0).WithMessage("Priority ID is required.");

            RuleFor(x => x.AssignedScore)
                .GreaterThanOrEqualTo(0).WithMessage("Assigned Score must be greater than or equal to 0.");

            RuleFor(x => x.FacultyRemarks)
                .MaximumLength(500).WithMessage("Faculty Remarks cannot exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.FacultyRemarks));

            RuleFor(x => x.StudentRemarks)
                .MaximumLength(500).WithMessage("Student Remarks cannot exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.StudentRemarks));

            RuleFor(x => x.FileUrl)
                .MaximumLength(500).WithMessage("File Url cannot exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.FileUrl));
        }
    }
}