namespace ChatApp.Web.Models.IdentityViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class CreateUserViewModel
    {

        [Required]
        [StringLength(
            maximumLength:WebConstants.UserUsernameMaxLength,
            ErrorMessage = WebConstants.StringLengthErrorMessage, 
            MinimumLength = WebConstants.UserUsernameMinLength)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(
            maximumLength:WebConstants.UserPasswordMaxLength,
            ErrorMessage = WebConstants.StringLengthErrorMessage, 
            MinimumLength = WebConstants.UserPasswordMinLength)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", 
            ErrorMessage = WebConstants.PasswordsDontMatchErrorMessage)]
        public string ConfirmPassword { get; set; }

    }
}
