using MLS_Digital_Management_System_Front_End.Core.DTOs.SubcommitteeThread;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Thread;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Net.Http.Json;

namespace MLS_Digital_Management_System_Front_End.Services;

public class SubcommitteeThreadService : ISubcommitteeThreadService
{
    private readonly HttpClient _httpClient;

    public SubcommitteeThreadService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ReadSubcommitteeThreadDTO>> GetAllSubcommitteeThreadsAsync()
    {
        var response = await _httpClient.GetAsync("api/SubcommitteeThreads/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadSubcommitteeThreadDTO>>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        else
        {
            throw new InvalidOperationException("Failed to get subcommittee threads");
        }
    }

    public async Task<ReadSubcommitteeThreadDTO> GetSubcommitteeThreadByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/SubcommitteeThreads/GetSubcommitteeThreadById/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadSubcommitteeThreadDTO>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get subcommittee thread with ID {id}.");
        }
    }
}
