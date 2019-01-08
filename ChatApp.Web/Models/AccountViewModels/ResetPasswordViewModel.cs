﻿namespace ChatApp.Web.Models.AccountViewModels
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
            maximumLength:GlobalConstants.UserPasswordMaxLength, 
            MinimumLength = GlobalConstants.UserPasswordMinLength,
            ErrorMessage = GlobalConstants.StringLengthErrorMessage)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", 
            ErrorMessage = GlobalConstants.PasswordsDontMatchErrorMessage)]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
}
