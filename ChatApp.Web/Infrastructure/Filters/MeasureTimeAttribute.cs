namespace ChatApp.Web.Infrastructure.Filters
{
    using System;
    using System.Diagnostics;
    using System.Globalization;
    using System.IO;
    using Microsoft.AspNetCore.Mvc.Filters;

    public class MeasureTimeAttribute : ActionFilterAttribute
    {
        private Stopwatch stopwatch;

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            this.stopwatch = Stopwatch.StartNew();
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            this.stopwatch.Stop();

            using (var writer = new StreamWriter("action-times.txt", true))
            {
                var dateTime = DateTime.UtcNow.ToString("yyyy/MM/dd hh:mm:ss.fff", CultureInfo.InvariantCulture);
                var controller = context.RouteData.Values["controller"]; // var controller = context.Controller.GetType().Name;
                var action = context.RouteData.Values["action"];
                var elapsedTime = this.stopwatch.Elapsed;

                var logMessage = $"{dateTime} – {elapsedTime} – {controller}.{action}";
                writer.WriteLine(logMessage);
            }
        }
    }
}
