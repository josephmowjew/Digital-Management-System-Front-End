using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class CpdUnitsEarnedService : ICpdUnitsEarnedService
{
    private readonly HttpClient _httpClient;
    public CpdUnitsEarnedService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<int> GetCpdSummedUnitsEarnedById(int id)
    {
        var response = await _httpClient.GetAsync($"api/CPDUnitsEarned/GetSummedCPDUnitsEarnedByMemberId/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<int>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get summed CPD units earned for id {id}.");
        }
    }
}
