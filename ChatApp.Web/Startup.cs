namespace ChatApp.Web
{
    using AutoMapper;
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using ChatApp.Web.Hubs;
    using ChatApp.Web.Infrastructure;
    using ChatApp.Web.Infrastructure.Extensions;
    using ChatApp.Web.Services;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    //using Microsoft.AspNetCore.Owin;

    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IHostingEnvironment Env { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            this.Env = env;
        }




        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ChatAppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Set password strength requirements in development mode 
            // see also the passwords MinLength settings in the views
            if (this.Env.IsDevelopment())
            {
                services.AddIdentity<User, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 1;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                })
                    .AddEntityFrameworkStores<ChatAppDbContext>()
                    .AddDefaultTokenProviders();
            }
            else
            {
                services.AddIdentity<User, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequireUppercase = true;
                })
                    .AddEntityFrameworkStores<ChatAppDbContext>()
                    .AddDefaultTokenProviders();
            }


            // FACEBOOK
            services.AddAuthentication().AddFacebook(facebookOptions =>
            {
                facebookOptions.AppId = Configuration["Authentication:Facebook:AppId"];
                facebookOptions.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
                facebookOptions.Events.OnRemoteFailure = (context) =>
                {
                    context.Response.Redirect("/account/login");
                    context.HandleResponse();
                    return System.Threading.Tasks.Task.FromResult(0);
                };
            });

            // GOOGLE
            services.AddAuthentication().AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = Configuration["Authentication:Google:ClientId"];
                googleOptions.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
            });

            // MICROSOFT
            services.AddAuthentication().AddMicrosoftAccount(microsoftOptions =>
            {
                microsoftOptions.ClientId = Configuration["Authentication:Microsoft:ApplicationId"];
                microsoftOptions.ClientSecret = Configuration["Authentication:Microsoft:Password"];
            });


            // Add application services.
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddDomainServices();


            // Add AutoMapper   (depends on AutoMapper.Extensions.Microsoft.DependencyInjection)
            services.AddAutoMapper();



            services.AddMvc(options =>
            {
                options.Filters.Add<AutoValidateAntiforgeryTokenAttribute>();
            });

            services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
            {
                builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithOrigins(GlobalConstants.Domain)
                    .AllowCredentials();
            }));

            services.AddSignalR();
        }



        // CONFIGURE

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDatabaseMigrations();

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseAuthentication();


            app.UseCookiePolicy();
            app.UseCors("CorsPolicy");

            // add SignalR as middleware
            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chatHub");
            });


            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
