namespace ChatApp.Web.Infrastructure.Filters
{
    using Microsoft.AspNetCore.Mvc.Filters;
    using System;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;

    public class LogAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            try
            {
                Task.Run(async () =>
                {
                    using (var writer = new StreamWriter(WebConstants.LogFilename, true))
                    {
                        var dateTime = DateTime.UtcNow.ToString(WebConstants.LogDateTimeFormat, CultureInfo.InvariantCulture);
                        var ipAddress = context.HttpContext.Connection.RemoteIpAddress;
                        var userName = context.HttpContext.User?.Identity?.Name ?? "Anonymous";
                        var controller = context.Controller.GetType().Name; // context.RouteData.Values["controller"]
                    var action = context.RouteData.Values["action"];

                        var logMessage = $"{dateTime} – {ipAddress} – {userName} – {controller}.{action}";
                        if (context.Exception != null)
                        {
                            var exceptiontype = context.Exception.GetType().Name;
                            var exceptionMessage = context.Exception.Message;
                            logMessage = $"[!]{logMessage} – {exceptiontype} – {exceptionMessage}";
                        }

                        await writer.WriteLineAsync(logMessage);
                    }
                })
                .GetAwaiter()
                .GetResult();
            }
            catch (Exception e)
            {
                Console.WriteLine($"ERROR: {e.Message}");
            }

        }
    }
}
