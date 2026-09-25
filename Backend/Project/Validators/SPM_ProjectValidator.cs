using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_ProjectValidator : AbstractValidator<SPM_Project>
    {
        public SPM_ProjectValidator()
        {
            RuleFor(x => x.ProjectTitle)
                .NotEmpty().WithMessage("Project Title is required.")
                .MaximumLength(200).WithMessage("Project Title cannot exceed 200 characters.");

            RuleFor(x => x.StudentId)
                .GreaterThan(0).WithMessage("Student is required.");

            RuleFor(x => x.FacultyId)
                .GreaterThan(0).WithMessage("Faculty is required.");

            RuleFor(x => x.ProjectStatus)
                .GreaterThan(0).WithMessage("Project Status is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start Date is required.");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End Date is required.")
                .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End Date must be greater than or equal to Start Date.");

            RuleFor(x => x.ProgressPercentage)
                .InclusiveBetween(0, 100).WithMessage("Progress Percentage must be between 0 and 100.");
        }
    }
}