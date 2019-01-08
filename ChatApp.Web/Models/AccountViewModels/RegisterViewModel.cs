﻿namespace ChatApp.Web.Models.AccountViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class RegisterViewModel
    {
        [Required]
        [StringLength(
            maximumLength: GlobalConstants.UserUsernameMaxLength,
            MinimumLength = GlobalConstants.UserUsernameMinLength,
            ErrorMessage = GlobalConstants.StringLengthErrorMessage)]
        [RegularExpression("[A-Za-z]+", ErrorMessage = "Username must have only letters.")]
        public string Username { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "This is not a valid email address.")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(
            maximumLength:GlobalConstants.UserPasswordMaxLength,
            MinimumLength = GlobalConstants.UserPasswordMinLength,
            ErrorMessage = GlobalConstants.StringLengthErrorMessage)]
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
