using FluentValidation;
using WebApplication1.Model;

namespace WebApplication1.Validators
{
    public class SPM_UserValidator : AbstractValidator<SPM_User>
    {
        public SPM_UserValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required.")
                .MaximumLength(150).WithMessage("Full Name cannot exceed 150 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.")
                .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.");

            RuleFor(x => x.MobileNumber)
                .NotEmpty().WithMessage("Mobile Number is required.")
                .MaximumLength(15).WithMessage("Mobile Number cannot exceed 15 characters.");

            RuleFor(x => x.ProfilePicturePath)
                .NotEmpty().WithMessage("Profile Picture Path is required.")
                .MaximumLength(500).WithMessage("Profile Picture Path cannot exceed 500 characters.");
        }
    }
}