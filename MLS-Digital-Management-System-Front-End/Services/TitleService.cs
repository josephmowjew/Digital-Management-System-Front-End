using MLS_Digital_Management_System_Front_End.Core.DTOs.Title;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class TitleService : ITitleService
{
    private readonly HttpClient _httpClient;

     public TitleService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        //_httpClient.BaseAddress = new Uri("http://localhost:5043");
    }

    public Task<CreateTitleDTO> AddTitle(CreateTitleDTO createTitleDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadTitleDTO>> GetAllTitlesAsync()
    {
         var response = await _httpClient.GetAsync("api/Titles/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadTitleDTO>>();

             return responseData;
        }
        else
        {
            throw new InvalidOperationException("Invalid email or password.");
        }
    }

    public Task<ReadTitleDTO> GetTitleByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task RemoveTitle(int id)
    {
        throw new NotImplementedException();
    }

    public Task<ReadTitleDTO> UpdateTitle(UpdateTitleDTO updateTitleDTO)
    {
        throw new NotImplementedException();
    }
}