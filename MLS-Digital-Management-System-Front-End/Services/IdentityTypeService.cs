using MLS_Digital_Management_System_Front_End.Core.DTOs.IdentityType;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class IdentityTypeService : IIdentityTypeService
{
    private readonly HttpClient _httpClient;
    public IdentityTypeService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        
    }
    public Task<ReadIdentityTypeDTO> AddIdentityType(CreateIdentityTypeDTO identityType)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadIdentityTypeDTO>> GetAllIdentityTypesAsync()
    {
        var response = await _httpClient.GetAsync("api/IdentityTypes/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadIdentityTypeDTO>>();

             return responseData;
        }
        else
        {
            throw new InvalidOperationException("Invalid email or password.");
        }
    }

    

    public Task<ReadIdentityTypeDTO> GetIdentityTypeByIdAsync(int id)
    {
        throw new NotImplementedException();
    }
}