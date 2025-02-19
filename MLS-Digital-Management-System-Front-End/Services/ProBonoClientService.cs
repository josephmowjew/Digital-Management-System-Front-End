using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class ProBonoClientService : IProBonoClientService
{
    private readonly HttpClient _httpClient;
    public ProBonoClientService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<ReadProBonoClientDTO> CreateProBonoClientAsync(CreateProBonoClientDTO createProBonoClientDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadProBonoClientDTO>> GetAllProBonoClientsAsync()
    {
         var response = await _httpClient.GetAsync($"api/ProBonoClients/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadProBonoClientDTO>>();
            return responseData;
        }
        else
        {
            string responseAsString = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Failed to get probono clients.");
        }
    }

    public async Task<ReadProBonoClientDTO> GetProBonoClientByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/probonoclients/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadProBonoClientDTO>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get probono client with ID {id}.");
        }
    }

    public Task<ReadProBonoClientDTO> UpdateProBonoClientAsync(UpdateProBonoClientDTO updateProBonoClientDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<int> GetClientsCountAsync()
    {
        var response = await _httpClient.GetAsync($"api/probonoclients/count");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<int>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get probono clients count.");
        }
    }

    public async Task<int> GetDeleteRequestCount()
    {
        var response = await _httpClient.GetAsync($"api/probonoclients/count/deleteRequests");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<int>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get probono clients delete requests count.");
        }
    }
}