using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class LicenseApplicationService : ILicenseApplicationService
{
    private readonly HttpClient _httpClient;
    public LicenseApplicationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> CheckIfPreviousApplicationExists(string userId)
    {
        var response = await _httpClient.GetAsync($"api/licenseApplications/HasMemberMadePreviousApplications/{userId}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<bool>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to check if previous application exists for user {userId}.");
        }
    }

    public async Task<ReadLicenseApplicationDTO> GetLicenseApplication(int id)
    {
        var response = await _httpClient.GetAsync($"api/licenseApplications/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadLicenseApplicationDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get license application with ID {id}.");
        }
    }
}