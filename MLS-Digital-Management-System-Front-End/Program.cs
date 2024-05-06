using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using MLS_Digital_Management_System_Front_End.Core.Middleware;
using MLS_Digital_Management_System_Front_End.Services;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpClient();
//builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IIdentityTypeService, IdentityTypeService>();

builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.Name = "MLS-Digital-MGM"; // Set a custom cookie name if needed
                options.Cookie.HttpOnly = true; // Ensure the cookie is HTTP-only
                options.ExpireTimeSpan = TimeSpan.FromDays(1); // Set the cookie expiration time
                options.SlidingExpiration = true; // Enable sliding expiration
                options.LoginPath = "/";
            }).AddGoogle(options =>
            {
                options.ClientId = "723867796897-tojeu8iorcr4osf8ml10hu931idroise.apps.googleusercontent.com";
                options.ClientSecret = "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";
            });
            // Add support for the external authentication scheme
            //.AddScheme<AuthenticationSchemeOptions, ExternalAuthenticationHandler>("Identity.External", options => { });
        

// builder.Services.AddSession(options =>
// {
//     options.IdleTimeout = TimeSpan.FromDays(1);
// });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

//app.UseSession();

app.UseEndpoints(endpoints =>
{

    endpoints.MapControllerRoute(
name: "areas",
pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
);
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

});


app.Run();
