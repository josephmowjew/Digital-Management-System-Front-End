using MLS_Digital_Management_System_Front_End.Core.DTOs.QualificationType;
using MLS_Digital_Management_System_Front_End.Models;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace MLS_Digital_Management_System_Front_End.Services
{
  public class QualificationTypeService : IQualificationTypeService
  {
    private readonly HttpClient _httpClient;

    public QualificationTypeService(HttpClient httpClient)
    {
      _httpClient = httpClient; 
    }

    public async Task<IEnumerable<ReadQualificationTypeDTO>> GetAllAsync()
    {
      var response = await _httpClient.GetAsync("api/QualificationTypes/getAll");
      if (response.IsSuccessStatusCode)
      {
        var responseData = await response.Content.ReadFromJsonAsync<List<ReadQualificationTypeDTO>>(); 
        return responseData;
      }
      else
      {
        throw new InvalidOperationException("Failed to get qualification types.");
      }
    }

    public async Task<ReadQualificationTypeDTO> GetByIdAsync(int id)
    {
      // TODO: Implement get by id method
       throw new NotImplementedException();
    }

    public async Task<ReadQualificationTypeDTO> AddAsync(CreateQualificationTypeDTO qualificationType) 
    {
      // TODO: Implement add method
       throw new NotImplementedException();
        
    }

    public async Task<ReadQualificationTypeDTO> UpdateAsync(UpdateQualificationTypeDTO qualificationType)
    {
      // TODO: Implement update method
       throw new NotImplementedException();
    }

    public async Task DeleteAsync(int id)
    {
      // TODO: Implement delete method
       throw new NotImplementedException();
    }
  }
}
