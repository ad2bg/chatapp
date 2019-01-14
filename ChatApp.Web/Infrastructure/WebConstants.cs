namespace ChatApp.Web.Infrastructure
{
    public class WebConstants
    {
        public const string Domain = "http://localhost:55555/";
        public const string AdministratorRole = "Administrator";
        public const string AdministratorEmail = "admin@mysite.com";
        public const string PublicRoomName = "Public";
        public const string LogFilename = "log.txt";
        public const string LogMeasureTimeFilename = "action-times.txt";
        public const string LogDateTimeFormat = "yyyy/MM/dd hh:mm:ss.fff";
        public const string SuccessMessage = "SuccessMessage";
        public const string ErrorMessage = "ErrorMessage";
        public const string StringLengthErrorMessage = "The {0} must be at least {2} and at max {1} characters long.";
        public const string PasswordsDontMatchErrorMessage = "The password and confirmation password do not match.";
        public const int UserUsernameMinLength = 1;
        public const int UserUsernameMaxLength = 50;
        public const int UserPasswordMinLength = 1;
        public const int UserPasswordMaxLength = 30;
        public const int MessageMinLength = 1;
        public const int MessageMaxLength = 10000;
        public const int RoomNameMinLength = 1;
        public const int RoomNameMaxLength = 250;
    }
}
