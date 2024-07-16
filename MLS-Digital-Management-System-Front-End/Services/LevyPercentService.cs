using MLS_Digital_Management_System_Front_End.Core.DTOs.LevyPercent;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class LevyPercentService : ILevyPercentService
    {
        private readonly HttpClient _httpClient;

        public LevyPercentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ReadLevyPercentDTO>> GetAllLevyPercentsAsync()
        {
            var response = await _httpClient.GetAsync($"api/LevyPercents/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadLevyPercentDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get levy percents");
            }
        }

        public async Task<int> GetLevyPercentsCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/LevyPercents/count");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<int>();
                return responseData;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get levy percents count");
            }
        }
    }
}






