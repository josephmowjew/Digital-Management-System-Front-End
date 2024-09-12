
using MLS_Digital_Management_System_Front_End.Core.DTOs.Signature;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class SignatureService : ISignatureService
{
    private readonly HttpClient _httpClient;

    public SignatureService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ReadSignatureDTO> GetSignatureByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/Signatures/singleSignature/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadSignatureDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get signature with ID {id}.");
        }
    }
}
