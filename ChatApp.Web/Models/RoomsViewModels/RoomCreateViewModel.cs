namespace ChatApp.Web.Models.RoomsViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class RoomCreateViewModel
    {

        [Required]
        [StringLength(
            maximumLength:WebConstants.RoomNameMaxLength,
            MinimumLength = WebConstants.RoomNameMinLength,
            ErrorMessage = WebConstants.StringLengthErrorMessage)]
        public string RoomName { get; set; }
    }
}
