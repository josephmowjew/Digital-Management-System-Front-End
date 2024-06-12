using MLS_Digital_Management_System_Front_End.Core.DTOs.IdentityType;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class UserService : IUserService
{
    private readonly HttpClient _httpClient;
    public UserService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<CreateUserDTO> CreateUserAsync(CreateUserDTO user)
    {
        var response = await _httpClient.PostAsJsonAsync("api/users", user);
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<CreateUserDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to create user.");
        }
    }

    public async Task<List<ReadUserDTO>> GetAllUsersAsync()
    {
        var response = await _httpClient.GetAsync("api/users/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadUserDTO>>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get users.");
        }
    }

    public async Task<ReadUserDTO> GetUserByIdAsync(string id)
    {
        var response = await _httpClient.GetAsync($"api/users/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadUserDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get user with id {id}.");
        }
    }
}