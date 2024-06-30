using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class ProBonoApplicationService : IProBonoApplicationService
{
    private readonly HttpClient _httpClient;
    public ProBonoApplicationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
   
    public async Task<List<ReadProBonoClientDTO>> GetAllProBonoApplicationByMemberIdAsync()
    {
         var response = await _httpClient.GetAsync($"api/ProBonoClients/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadProBonoClientDTO>>();
            return responseData;
        }
        else
        {
            string responseAsString = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Failed to get probono clients.");
        }
    }
}