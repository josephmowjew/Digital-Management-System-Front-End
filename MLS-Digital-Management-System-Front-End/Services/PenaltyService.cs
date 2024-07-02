using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class PenaltyService : IPenaltyService
    {
        private readonly HttpClient _httpClient;

        public PenaltyService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<ReadPenaltyDTO>> GetAllPenaltiesAsync()
        {
            var response = await _httpClient.GetAsync($"api/Penalties/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadPenaltyDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {

                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get penalties");
            }
        }

        public async Task<int> GetPenaltiesCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/Penalties/count");
            if (response.IsSuccessStatusCode)
            {
                var count = await response.Content.ReadFromJsonAsync<int>();
                return count;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get ProBono count");
            }
        }
    }
}
