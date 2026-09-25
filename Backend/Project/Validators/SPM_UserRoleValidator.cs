using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_UserRoleValidator : AbstractValidator<SPM_UserRole>
    {
        public SPM_UserRoleValidator()
        {
            RuleFor(x => x.RoleId)
                .GreaterThan(0).WithMessage("Role ID is required.");

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("User ID is required.");
        }
    }
}