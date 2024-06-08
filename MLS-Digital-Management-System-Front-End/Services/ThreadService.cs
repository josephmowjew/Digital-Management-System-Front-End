using MLS_Digital_Management_System_Front_End.Core.DTOs.Thread;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Net.Http.Json;

namespace MLS_Digital_Management_System_Front_End.Services;

public class ThreadService : IThreadService
{
    private readonly HttpClient _httpClient;

    public ThreadService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ReadThreadDTO>> GetAllThreadsAsync()
    {
        var response = await _httpClient.GetAsync("api/Threads/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadThreadDTO>>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        else
        {
            throw new InvalidOperationException("Failed to get threads");
        }
    }

    public async Task<ReadThreadDTO> GetThreadByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/Threads/GetThreadById/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadThreadDTO>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get thread with ID {id}.");
        }
    }
}
