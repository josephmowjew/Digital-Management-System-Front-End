using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class YearOfOperationService : IYearOfOperationService
{
    private readonly HttpClient _httpClient;
    public YearOfOperationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    public async Task<List<ReadYearOfOperationDTO>> GetAllYearOfOperationsAsync()
    {
         var response = await _httpClient.GetAsync($"api/YearOfOperations/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadYearOfOperationDTO>>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get years of operationW.");
        }
    }
}