using MLS_Digital_Management_System_Front_End.Core.DTOs.Communication;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class CommunicationService : ICommunicationService
{
    private readonly HttpClient _httpClient;
    public CommunicationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadMessageDTO> GetCommunicationByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/Communications/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadMessageDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get Communication with id {id}.");
        }
    }
}
