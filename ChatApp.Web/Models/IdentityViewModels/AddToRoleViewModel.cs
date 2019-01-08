namespace ChatApp.Web.Models.IdentityViewModels
{
    using ChatApp.Data.Models;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using System.Collections.Generic;

    public class AddToRoleViewModel
    {
        public User User { get; set; }

        public IEnumerable<SelectListItem> Roles { get; set; }
    }
}
