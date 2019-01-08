namespace ChatApp.Web.Infrastructure.Extensions
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using System.Threading.Tasks;

    public static class ApplicationBuilderExtensions
    {

        // Migrate database; This is used in Startup.cs
        public static IApplicationBuilder UseDatabaseMigrations(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetService<ChatAppDbContext>().Database.Migrate();

                SeedAdminInAdminRole(serviceScope);
            }
            return app;
        }


        private static void SeedAdminInAdminRole(IServiceScope serviceScope)
        {
            var userManager = serviceScope.ServiceProvider.GetService<UserManager<User>>();
            var roleManager = serviceScope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
            Task.Run(async () =>
            {
                var adminRoleName = GlobalConstants.AdministratorRole;

                var roleExists = await roleManager.RoleExistsAsync(adminRoleName);

                if (!roleExists)
                {
                    var result = await roleManager.CreateAsync(new IdentityRole
                    {
                        Name = adminRoleName
                    });
                }

                var adminEmail = GlobalConstants.AdministratorEmail;

                var adminUser = await userManager.FindByNameAsync(adminEmail);
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        Email = adminEmail,
                        UserName = adminEmail,
                    };

                    string adminPassword = "admin12";
                    var result = await userManager.CreateAsync(adminUser, adminPassword);
                    if (result == IdentityResult.Success) await userManager.AddToRoleAsync(adminUser, adminRoleName);
                }
            })
            .Wait();
        }
    }
}
