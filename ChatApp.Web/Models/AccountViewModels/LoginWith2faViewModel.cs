namespace ChatApp.Web.Models.AccountViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class LoginWith2faViewModel
    {
        [Required]
        [StringLength(7, ErrorMessage = WebConstants.StringLengthErrorMessage, MinimumLength = 6)]
        [DataType(DataType.Text)]
        [Display(Name = "Authenticator code")]
        public string TwoFactorCode { get; set; }

        [Display(Name = "Remember this machine")]
        public bool RememberMachine { get; set; }

        public bool RememberMe { get; set; }
    }
}
