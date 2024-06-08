using MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyPayment;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class PenaltyPaymentService : IPenaltyPaymentService
    {
        private readonly HttpClient _httpClient;

        public PenaltyPaymentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<ReadPenaltyPaymentDTO>> GetAllPenaltyPaymentsAsync()
        {
            var response = await _httpClient.GetAsync($"api/PenaltyPayments/getAll");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<List<ReadPenaltyPaymentDTO>>();
                return responseData;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {

                return null;
            }
            else
            {
                throw new InvalidOperationException($"Failed to get penalty Payments");
            }
        }
    }
}
