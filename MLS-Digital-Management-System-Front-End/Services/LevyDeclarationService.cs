using MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class LevyDeclarationService : ILevyDeclarationService
    {
        private readonly HttpClient _httpClient;

        public LevyDeclarationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ReadLevyDeclarationDTO>> GetAllLevyDeclarationsAsync()
        {
            var response = await _httpClient.GetAsync($"api/LevyDeclarations/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadLevyDeclarationDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get levy declarations");
            }
        }

        public async Task<int> GetLevyDeclarationsCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/LevyDeclarations/count");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<int>();
                return responseData;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get levy declarations count");
            }
        }
    }
}
