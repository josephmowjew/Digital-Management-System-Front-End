using MLS_Digital_Management_System_Front_End.Core.DTOs.InstitutionType;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class InstitutionTypeService : IInstitutionTypeService
{
    private readonly HttpClient _httpClient;
    public InstitutionTypeService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        
    }
    public Task<ReadInstitutionTypeDTO> AddInstitutionType(CreateInstitutionTypeDTO InstitutionType)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadInstitutionTypeDTO>> GetAllInstitutionTypesAsync()
    {
        var response = await _httpClient.GetAsync("api/InstitutionTypes/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadInstitutionTypeDTO>>();

             return responseData;
        }
        else
        {
            throw new InvalidOperationException("Invalid credentials .");
        }
    }

    

    public Task<ReadInstitutionTypeDTO> GetInstitutionTypeByIdAsync(int id)
    {
        throw new NotImplementedException();
    }
}