using MLS_Digital_Management_System_Front_End.Core.DTOs.Country;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ICountryService
{
    Task<List<ReadCountryDTO>> GetCountries();
    Task<ReadCountryDTO> GetCountry(int id);
    Task<ReadCountryDTO> AddCountry(CreateCountryDTO country);
    Task<ReadCountryDTO> UpdateCountry(UpdateCountryDTO country);
    Task<ReadCountryDTO> RemoveCountry(int id);
    Task<int> GetCountryCount();
}
