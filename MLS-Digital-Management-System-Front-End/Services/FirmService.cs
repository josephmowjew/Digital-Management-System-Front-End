using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class FirmService : IFirmService
{
    private readonly HttpClient _httpClient;
    public FirmService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    public Task<ReadFirmDTO> CreateFirmAsync(CreateFirmDTO createFirmDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadFirmDTO>> GetAllFirmsAsync()
    {
         var response = await _httpClient.GetAsync($"api/firms/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadFirmDTO>>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get firms.");
        }
    }

    public async Task<int> GetFirmsCount(){
        var response = await _httpClient.GetAsync($"api/firms/count");
        if (response.IsSuccessStatusCode)
        {
            var count = await response.Content.ReadFromJsonAsync<int>();
            return count;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get Firm count");
        }
    }

    public async Task<ReadFirmDTO> GetFirmByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/firms/getfirm/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadFirmDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get firm by id.");
        }   
    }

   

   
}