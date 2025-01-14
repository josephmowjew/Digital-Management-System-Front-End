using MLS_Digital_Management_System_Front_End.Core.DTOs.Stamp;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class StampService : IStampService
{
    private readonly HttpClient _httpClient;

    public StampService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadStampDTO> GetStampByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/Stamp/singleStamp/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadStampDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get stamp with ID {id}.");
        }
    }

    public async Task<ReadStampDTO> GetStampByNameAsync(string name)
    {
        var response = await _httpClient.GetAsync($"api/Stamp/stampByName/{name}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadStampDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get stamp with name {name}.");
        }
    }
}