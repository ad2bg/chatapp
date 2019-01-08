namespace ChatApp.Web.Models.IdentityViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class IdentityChangePasswordViewModel
    {
        public string Email { get; set; }

        [Required]
        [StringLength(
            maximumLength: GlobalConstants.UserPasswordMaxLength, 
            ErrorMessage = GlobalConstants.StringLengthErrorMessage, 
            MinimumLength = GlobalConstants.UserPasswordMinLength)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", 
            ErrorMessage = GlobalConstants.PasswordsDontMatchErrorMessage)]
        public string ConfirmPassword { get; set; }
    }
}
