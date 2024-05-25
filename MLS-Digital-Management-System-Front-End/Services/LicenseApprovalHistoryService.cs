using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class LicenseApprovalHistoryService : ILicenseApprovalHistoryService
{
    private readonly HttpClient _httpClient;

    public LicenseApprovalHistoryService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ReadLicenseApprovalHistoryDTO>> GetLicenseApprovalHistoryByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/LicenseApprovalHistories/GetLicenseApprovalHistoryByLicenseApplicationId/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadLicenseApprovalHistoryDTO>>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get license approval history with ID {id}.");
        }
    }
}
