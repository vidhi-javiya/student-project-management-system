using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_PriorityValidator : AbstractValidator<SPM_Priority>
    {
        public SPM_PriorityValidator()
        {
            RuleFor(x => x.PriorityName)
                .NotEmpty().WithMessage("Priority Name is required.")
                .MaximumLength(20).WithMessage("Priority Name cannot exceed 20 characters.");

            RuleFor(x => x.PriortyCssClass)
                .NotEmpty().WithMessage("Priority CSS Class is required.")
                .MaximumLength(20).WithMessage("Priority CSS Class cannot exceed 20 characters.");
        }
    }
}