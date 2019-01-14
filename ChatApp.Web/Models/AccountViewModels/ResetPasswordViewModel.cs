namespace ChatApp.Web.Models.AccountViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;
   
    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(
            maximumLength:WebConstants.UserPasswordMaxLength, 
            MinimumLength = WebConstants.UserPasswordMinLength,
            ErrorMessage = WebConstants.StringLengthErrorMessage)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", 
            ErrorMessage = WebConstants.PasswordsDontMatchErrorMessage)]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
}
