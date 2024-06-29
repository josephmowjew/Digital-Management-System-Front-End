using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class InvoiceRequestService : IInvoiceRequestService
{
    private readonly HttpClient _httpClient;
    public InvoiceRequestService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadInvoiceRequestDTO> GetInvoiceRequestByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/invoiceRequest/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadInvoiceRequestDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get invoice request with id {id}.");
        }
    }
}
