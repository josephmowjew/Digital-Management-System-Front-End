using MLS_Digital_Management_System_Front_End.Core.DTOs.License;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class LicenseService : ILicenseService
{
    private readonly HttpClient _httpClient;

    public LicenseService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadLicenseDTO> GetLicense(int id)
    {
        var response = await _httpClient.GetAsync($"api/license/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadLicenseDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get license with ID {id}.");
        }
    }

    public async Task<int> GetLicensesTotal()
    {
        var response = await _httpClient.GetAsync($"api/licenses/count");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<int>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get license count");
        }
    }

    public async Task<ReadLicenseDTO> GetLicenseByNumber(string licenseNumber)
    {
        var response = await _httpClient.GetAsync($"api/licenseApplications/byNumber/{licenseNumber}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadLicenseDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get a license with license number {licenseNumber}.");
        }
    }
}
