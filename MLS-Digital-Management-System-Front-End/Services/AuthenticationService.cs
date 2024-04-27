using System.Text;
using Core.Models;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using Newtonsoft.Json;

namespace MLS_Digital_Management_System_Front_End.Services
{
  public class AuthenticationService : IAuthenticationService
  {
    private readonly HttpClient _httpClient;
    public AuthenticationService(HttpClient httpClient)
    {
       this._httpClient = httpClient;
    }
    public async Task<AuthData> LoginAsync(string email, string password)
    {
       var loginData = new { Email = email, Password = password };
        var json = JsonConvert.SerializeObject(loginData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/auth/login", content);
        if (response.IsSuccessStatusCode)
        {
            var responseText = await response.Content.ReadAsStringAsync();
            var responseData = await response.Content.ReadFromJsonAsync<AuthData>();

             return responseData;
        }
        else
        {
            throw new InvalidOperationException("Invalid email or password.");
        }
    }
  }
}
