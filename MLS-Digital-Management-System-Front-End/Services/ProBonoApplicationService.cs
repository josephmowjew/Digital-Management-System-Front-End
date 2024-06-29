using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class ProBonoApplicationService : IProBonoApplicationService
    {
        private readonly HttpClient _httpClient;
        public ProBonoApplicationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<int> GetProBonoApplicationCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/ProBonoApplications/count");
            if (response.IsSuccessStatusCode)
            {
                var count = await response.Content.ReadFromJsonAsync<int>();
                return count;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get ProBono Applications count");
            }
        }
    }
}
