namespace ChatApp.Web.Infrastructure.Extensions
{
    using ChatApp.Data;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;

    public static class ApplicationBuilderExtensions
    {
        // Migrate database; This is called from the Startup.cs file
        public static IApplicationBuilder UseDatabaseMigrations(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetService<ChatAppDbContext>().Database.Migrate();
            }

            return app;
        }
    }
}
