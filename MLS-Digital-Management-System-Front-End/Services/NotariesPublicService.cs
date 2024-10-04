using MLS_Digital_Management_System_Front_End.Core.DTOs.NotariesPublic;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class NotariesPublicService : INotariesPublicService
    {
        private readonly HttpClient _httpClient;

        public NotariesPublicService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ReadNotariesPublicDTO>> GetAllNotariesPublicAsync()
        {
            var response = await _httpClient.GetAsync($"api/NotaryPublic/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadNotariesPublicDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get notaries public");
            }
        }

        public async Task<int> GetNotariesPublicCountAsync()
        {
            var response = await _httpClient.GetAsync($"api/NotaryPublic/count");
            if (response.IsSuccessStatusCode)
            {
                var count = await response.Content.ReadFromJsonAsync<int>();
                return count;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get Notaries Public count");
            }
        }

        
        public async Task<ReadNotariesPublicDTO> GetNotaryPublicByMemberIdAsync(int memberId)
        {
            var response = await _httpClient.GetAsync($"api/NotaryPublic/getByMemberId/{memberId}");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<ReadNotariesPublicDTO>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get notary public for member ID {memberId}");
            }
        }
        

    }
}
