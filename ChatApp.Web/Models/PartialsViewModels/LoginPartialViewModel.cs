namespace ChatApp.Web.Models.PartialsViewModels
{
    public class LoginPartialViewModel
    {
        public string NavbarBgColor { get; set; }

        public string NavbarFgColor { get; set; }

        public LoginPartialViewModel(
            string navbarBgColor,
            string navbarFgColor)
        {
            this.NavbarBgColor = navbarBgColor;
            this.NavbarFgColor = navbarFgColor;
        }
    }
}
