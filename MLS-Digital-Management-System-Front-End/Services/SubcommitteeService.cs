using MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Net.Http;
using System.Net.Http.Json;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class SubcommitteeService : ISubcommitteeService
    {
        private readonly HttpClient _httpClient;

        public SubcommitteeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ReadSubcommitteeDTO> GetSubcommitteeByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/Subcommittees/GetSubcommitteeById/{id}");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<ReadSubcommitteeDTO>();
                return responseData;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get Subcommittee with id {id}.");
            }
        }

        public async Task<int> GetSubcommitteesCountAsync()
        {
            var response = await _httpClient.GetAsync("api/Subcommittees/count");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<int>();
                return responseData;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get Subcommittees Count.");
            }
        }
    }
}
