using MLS_Digital_Management_System_Front_End.Core.DTOs.Country;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class CountryService : ICountryService
{
  private readonly HttpClient _httpClient;

  public CountryService(HttpClient httpClient)
  {
    _httpClient = httpClient; 
  }



    public Task<ReadCountryDTO> UpdateCountry(UpdateCountryDTO country)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadCountryDTO>> GetCountries()
    {
         var response = await _httpClient.GetAsync("api/Countries/getAll");
        if (response.IsSuccessStatusCode)
        {
        var responseData = await response.Content.ReadFromJsonAsync<List<ReadCountryDTO>>();
        return responseData;
        }
        else
        {
        throw new InvalidOperationException("Failed to get countries.");
        }
    }

    public async Task<ReadCountryDTO> GetCountry(int id)
    {
        var response = await _httpClient.GetAsync($"api/Countries/{id}");
        if (response.IsSuccessStatusCode)
        {
        var responseData = await response.Content.ReadFromJsonAsync<ReadCountryDTO>();
        return responseData;
        }
        else
        {
        throw new InvalidOperationException("Failed to get countries.");
        }
    }

    public Task<ReadCountryDTO> AddCountry(CreateCountryDTO country)
    {
        throw new NotImplementedException();
    }

    public async Task<ReadCountryDTO> RemoveCountry(int id)
    {
        var response = await _httpClient.DeleteAsync($"api/Countries/{id}");
        if (response.IsSuccessStatusCode)
        {
        var responseData = await response.Content.ReadFromJsonAsync<ReadCountryDTO>();
        return responseData;
        }
        else
        {
        throw new InvalidOperationException("Failed to get countries.");
        }
    }

    public async Task<int> GetCountryCount()
    {
        var response = await _httpClient.GetAsync("api/Countries/count");
        if (response.IsSuccessStatusCode)
        {
        var responseData = await response.Content.ReadFromJsonAsync<int>();
        return responseData;
        }
        else
        {
        throw new InvalidOperationException("Failed to get countries.");
        }
    }
}
