using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Models;
using System.Diagnostics;
using System.Text;
using Newtonsoft.Json;
using MLS_Digital_Management_System_Front_End.ViewModels;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using IAuthenticationService = MLS_Digital_Management_System_Front_End.Services.Interfaces.IAuthenticationService;
using MLS_Digital_Management_System_Front_End.Services;
using MLS_Digital_Management_System_Front_End.Helpers;

namespace MLS_Digital_Management_System_Front_End.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IServiceRepository _service;

        public HomeController(ILogger<HomeController> logger,IServiceRepository service)
        {
            _logger = logger;
            _service = service;
        }

        public IActionResult Index()
        {
                //check if a token cookie already exist
            // if (HttpContext.Request.Cookies["token"] != null) {
                
            //     //check if the token hasn't expired
            //     if(!AuthHelper.IsTokenExpired(Request.Cookies["token"],HttpContext))
            //     {
            //         //get the rolename from the cookie
            //         var roleName = Request.Cookies["RoleName"];

            //         if(roleName .Equals("Administrator", StringComparison.OrdinalIgnoreCase)){

            //             return RedirectToAction("Index", "Home", new { Area = "Admin" });
            //         }
                    
                    
            //     }
            // }
            return View();
        }
         [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

        
            //check if the model is valid
            if(!ModelState.IsValid)
                {
                    return View("Index",model);
                }

                try
                {
                    var authData = await _service.AuthenticationService.LoginAsync(model.Email, model.Password);
                    // Store token in browser storage (sessionStorage or localStorage)

                     // Create claims for user identity
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, authData.TokenData.UserId),
                        new Claim(ClaimTypes.Name, $"{authData.TokenData.FirstName} {authData.TokenData.LastName}"),
                        new Claim(ClaimTypes.Role, authData.TokenData.Role),
                        new Claim("MLS-Digital-MGM", "Malawi Law Society Digital Management System"),
                    };

                    // Create claims identity
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    bool rememberMe = model.RememberMe == "on";
                    // Create authentication properties
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = rememberMe
                    };

                    // Sign in the user
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                    //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

                    // Store the token in a cookie (optional)
                    Response.Cookies.Append("token", authData.TokenData.Token);
                    Response.Cookies.Append("tokenExpiryTime",authData.TokenData.TokenExpiryMinutes.ToString());
                    Response.Cookies.Append("RoleName", authData.TokenData.Role);
                    Response.Cookies.Append("FirstName", authData.TokenData.FirstName);
                    Response.Cookies.Append("LastName", authData.TokenData.LastName);
                    Response.Cookies.Append("UserId",authData.TokenData.UserId);

                    //HttpContext.Session.SetString("token", authData.TokenData.Token);


                    //redirect based on role

                     if (authData.TokenData.Role.Equals("Administrator", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Admin" });
                    }
                    if(authData.TokenData.Role.Equals("Secretariat", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Secretariat" });
                    }
                     if(authData.TokenData.Role.Equals("Member", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Member" });
                    }
                    // Redirect to authorized page
                    return RedirectToAction("Index", "Home");
                }
                catch (InvalidOperationException ex)
                {
                    ModelState.AddModelError(string.Empty, ex.Message);
                    return View("Index", model);
                }
        }


        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Privacy()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
