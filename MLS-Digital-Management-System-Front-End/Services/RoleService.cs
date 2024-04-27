using MLS_Digital_Management_System_Front_End.Core.DTOs.Role;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;


public class RoleService : IRoleService
{
    
    private readonly HttpClient _httpClient;

    public RoleService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ReadRoleDTO>> GetAllRolesAsync()
    {
        var response = await _httpClient.GetAsync("api/Roles/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadRoleDTO>>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException("Failed to get roles.");
        }
    }

    public async Task<ReadRoleDTO> GetRoleByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/Roles/getById/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadRoleDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get role with ID {id}.");
        }
    }

    public async Task<ReadRoleDTO> AddRole(CreateRoleDTO createRoleDTO)
    {
        var response = await _httpClient.PostAsJsonAsync("api/Roles/add", createRoleDTO);
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadRoleDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException("Failed to add role.");
        }
    }
}