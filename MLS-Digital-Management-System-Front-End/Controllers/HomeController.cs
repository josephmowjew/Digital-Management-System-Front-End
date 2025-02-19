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
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Google;
using System.Reflection;

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
                        new Claim(ClaimTypes.Email, authData.TokenData.Email),
                        new Claim("MLS-Digital-MGM", "Malawi Law Society Digital Management System"),

                        // Custom claim for profile picture
                        new Claim("ProfilePicture", authData.TokenData.ProfilePicture ?? "/assets/images/profile/user-1.jpg"),
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
                    if(authData.TokenData.Role.Equals("Finance Officer", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Finance" });
                    }
                     if(authData.TokenData.Role.Equals("Complaints officer", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Complaints" });
                    }
                     if(authData.TokenData.Role.Equals("President", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Executive" });
                    }
                    if(authData.TokenData.Role.Equals("Honorary Secretary", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Executive" });
                    }
                    if (authData.TokenData.Role.Equals("CEO", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "CEO" });
                    }

                ModelState.AddModelError(string.Empty, "Sorry, could not find your dashboard");
                    // Redirect to authorized page
                    return View("Index",model);
                }
                catch (InvalidOperationException ex)
                {
                    ModelState.AddModelError(string.Empty, ex.Message);
                    return View("Index", model);
                }
        }

        [HttpGet]
        public async Task<IActionResult> GoogleLogin(string returnurl)
        {
            

            // Construct the Google authentication URL
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("ExternalLoginCallback", "Home", new { returnurl }),
                // Optionally, you can set other properties here
            };

            return Challenge(authenticationProperties, "Google");
            //return RedirectToAction("SignIn", "Account", new { provider = "Google", returnUrl = redirectUrl });
        }

        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            if (remoteError != null)
            {
                ModelState.AddModelError(string.Empty, $"Error from external provider: {remoteError}");
                return RedirectToAction("Index", "Home");
            }

            var loginInfo = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (loginInfo.Succeeded)
            {
                // User is authenticated, handle the login logic here

                // Extract user data from external login
                var externalUserId = loginInfo.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
                var firstName = loginInfo.Principal.FindFirstValue(ClaimTypes.GivenName);
                var lastName = loginInfo.Principal.FindFirstValue(ClaimTypes.Surname);
                var email = loginInfo.Principal.FindFirstValue(ClaimTypes.Email);

                // You can use this data to create or authenticate a user in your system
                // Example: Check if the user exists in your database
                try
                {
                    var authData = await _service.AuthenticationService.GoogleLoginAsync(email);

                    
                    // Store token in browser storage (sessionStorage or localStorage)

                    // Create claims for user identity
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, authData.TokenData.UserId),
                        new Claim(ClaimTypes.Name, $"{authData.TokenData.FirstName} {authData.TokenData.LastName}"),
                        new Claim(ClaimTypes.Role, authData.TokenData.Role),
                        new Claim(ClaimTypes.Email, authData.TokenData.Email),
                        new Claim("MLS-Digital-MGM", "Malawi Law Society Digital Management System"),
                    };

                    // Create claims identity
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    bool rememberMe = true;
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
                    Response.Cookies.Append("tokenExpiryTime", authData.TokenData.TokenExpiryMinutes.ToString());
                    Response.Cookies.Append("RoleName", authData.TokenData.Role);
                    Response.Cookies.Append("FirstName", authData.TokenData.FirstName);
                    Response.Cookies.Append("LastName", authData.TokenData.LastName);
                    Response.Cookies.Append("UserId", authData.TokenData.UserId);

                    //HttpContext.Session.SetString("token", authData.TokenData.Token);


                    //redirect based on role

                    if (authData.TokenData.Role.Equals("Administrator", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Admin" });
                    }
                    if (authData.TokenData.Role.Equals("Secretariat", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Secretariat" });
                    }
                    if (authData.TokenData.Role.Equals("Member", StringComparison.OrdinalIgnoreCase))
                    {
                        return RedirectToAction("Index", "Home", new { Area = "Member" });
                    }
                    // Redirect to authorized page
                    return RedirectToAction("Index", "Home");
                }
                catch (InvalidOperationException ex)
                {


                    TempData["errorResponse"] = ex.Message;

                    return View("Index");
                }
                catch ( Exception ex)
                {
                   
                    TempData["errorResponse"] = $"An error occured while processing your request. Kindly try again later";

                    return View("Index");

                }



            }
            else
            {
                ModelState.AddModelError(string.Empty, "Error loading external login information.");
                return RedirectToAction("Index", "Home");
            }
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }

        public IActionResult ResetPassword()
        {
            return View();
        }

        public IActionResult ForgotPassword()
        {
            return View();
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
