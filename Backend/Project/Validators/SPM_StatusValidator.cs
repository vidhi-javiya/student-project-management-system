using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_StatusValidator : AbstractValidator<SPM_Status>
    {
        public SPM_StatusValidator()
        {
            RuleFor(x => x.StatusName)
                .NotEmpty().WithMessage("Status Name is required.")
                .MaximumLength(20).WithMessage("Status Name cannot exceed 20 characters.");

            RuleFor(x => x.StatusCssClass)
                .NotEmpty().WithMessage("Status CSS Class is required.")
                .MaximumLength(100).WithMessage("Status CSS Class cannot exceed 100 characters.");
        }
    }
}