using MLS_Digital_Management_System_Front_End.Services.Interfaces;
namespace MLS_Digital_Management_System_Front_End.Services
{
    public class ProBonoService : IProBonoService
    {
        private readonly HttpClient _httpClient;
        public ProBonoService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<int> GetProBonoCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/ProBonos/count");
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
