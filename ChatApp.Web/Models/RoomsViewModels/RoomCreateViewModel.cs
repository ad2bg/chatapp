namespace ChatApp.Web.Models.RoomsViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class RoomCreateViewModel
    {

        [Required]
        [StringLength(50)]
        public string RoomName { get; set; }
    }
}
