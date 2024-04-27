using Microsoft.AspNetCore.Http;

namespace MLS_Digital_Management_System_Front_End.Helpers;
public static class AuthHelper
{
  public static string GetToken(HttpContext httpContext)
  {
    string token = null;
    if (httpContext.Request.Cookies["token"] != null)
    {
        token = httpContext.Request.Cookies["token"];
    }

    return token;
  }

  public static bool IsTokenExpired(string token, HttpContext httpContext) =>
    token == null || DateTime.TryParse(httpContext.Request.Cookies["tokenExpiryTime"], out var expiryTime) && DateTime.UtcNow > expiryTime;
  }

