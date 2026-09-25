using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_RoleValidator : AbstractValidator<SPM_Role>
    {
        public SPM_RoleValidator()
        {
            RuleFor(x => x.RoleName)
                 .Cascade(CascadeMode.Stop)
                 .NotEmpty().WithMessage("Role Name is required.")
                 .MinimumLength(2).WithMessage("Role Name must be at least 2 characters long.")
                 .MaximumLength(50).WithMessage("Role Name cannot exceed 50 characters.")
                 .Matches(@"^[a-zA-Z]+$").WithMessage("Role Name must contain only letters (no digits or special characters).");

            RuleFor(x => x.Description)
                .MaximumLength(250).WithMessage("Description cannot exceed 250 characters.");
        }
    }
}