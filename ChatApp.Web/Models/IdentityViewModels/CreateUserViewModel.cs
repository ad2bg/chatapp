namespace ChatApp.Web.Models.IdentityViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class CreateUserViewModel
    {

        [Required]
        [StringLength(
            maximumLength:GlobalConstants.UserUsernameMaxLength,
            ErrorMessage = GlobalConstants.StringLengthErrorMessage, 
            MinimumLength = GlobalConstants.UserUsernameMinLength)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(
            maximumLength:GlobalConstants.UserPasswordMaxLength,
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
