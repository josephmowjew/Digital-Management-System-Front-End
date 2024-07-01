using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class CpdTrainingService : ICpdTrainingService
{
    private readonly HttpClient _httpClient;
    public CpdTrainingService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadCPDTrainingDTO> GetCpdTrainingByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/CPDTrainings/GetCPDTrainingById/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadCPDTrainingDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get Trainging with id {id}.");
        }
    }

    public async Task<int> GetCpdTrainingsCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/CpdTrainings/count");
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
