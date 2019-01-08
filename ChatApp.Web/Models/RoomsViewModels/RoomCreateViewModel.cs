namespace ChatApp.Web.Models.RoomsViewModels
{
    using ChatApp.Web.Infrastructure;
    using System.ComponentModel.DataAnnotations;

    public class RoomCreateViewModel
    {

        [Required]
        [StringLength(
            maximumLength:GlobalConstants.RoomNameMaxLength,
            MinimumLength = GlobalConstants.RoomNameMinLength,
            ErrorMessage = GlobalConstants.StringLengthErrorMessage)]
        public string RoomName { get; set; }
    }
}
