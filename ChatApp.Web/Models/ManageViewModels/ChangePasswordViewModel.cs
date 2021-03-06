﻿namespace ChatApp.Web.Models.ManageViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class ChangePasswordViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(
            maximumLength:WebConstants.UserPasswordMaxLength, 
            MinimumLength = WebConstants.UserPasswordMinLength,
            ErrorMessage = WebConstants.StringLengthErrorMessage
            )]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", 
            ErrorMessage = WebConstants.PasswordsDontMatchErrorMessage)]
        public string ConfirmPassword { get; set; }

        public string StatusMessage { get; set; }
    }
}
