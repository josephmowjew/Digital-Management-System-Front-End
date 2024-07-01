using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class CpdTrainingRegistrationService : ICpdTrainingRegistrationService
{
    private readonly HttpClient _httpClient;
    public CpdTrainingRegistrationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<int> GetCpdTrainingsAttendedCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/CPDTrainingRegistrations/count");
            if (response.IsSuccessStatusCode)
            {
                var count = await response.Content.ReadFromJsonAsync<int>();
                return count;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get CPD Trainings count");
            }
        }
}
