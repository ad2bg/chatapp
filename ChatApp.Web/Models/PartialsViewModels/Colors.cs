namespace ChatApp.Web.Models.PartialsViewModels
{
    public class Colors
    {
        public string BackgroundColor { get; set; }
        public string ForegroundColor { get; set; }

        public Colors(
            string backgroundColor,
            string foregroundColor)
        {
            this.BackgroundColor = backgroundColor;
            this.ForegroundColor = foregroundColor;
        }
    }
}
