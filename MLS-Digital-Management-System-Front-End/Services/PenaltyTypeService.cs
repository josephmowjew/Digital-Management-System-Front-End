using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;
using MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyType;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class PenaltyTypeService : IPenaltyTypeService
    {
        private readonly HttpClient _httpClient;

        public PenaltyTypeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        public async Task<List<ReadPenaltyTypeDTO>> GetAllPenaltyTypesAsync()
        {
            var response = await _httpClient.GetAsync($"api/PenaltyType/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadPenaltyTypeDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {

                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get penalty types");
            }
        }
    }
}
