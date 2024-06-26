using MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Net.Http;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class CommitteeService : ICommitteeService
    {
        private readonly HttpClient _httpClient;
        public CommitteeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        
        public async Task<ReadCommitteeDTO> GetCommitteeByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/Committees/GetCommitteeById/{id}");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<ReadCommitteeDTO>();
                return responseData;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get Committee with id {id}.");
            }
        }
    }
}
