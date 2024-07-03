using MLS_Digital_Management_System_Front_End.Core.DTOs.Department;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;


public class DepartmentService : IDepartmentService
{
    private readonly HttpClient _httpClient;

    public DepartmentService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<ReadDepartmentDTO> CreateDepartment(CreateDepartmentDTO department)
    {
        throw new NotImplementedException();
    }

    public Task<ReadDepartmentDTO> DeleteDepartment(int id)
    {
        throw new NotImplementedException();
    }

    public Task<ReadDepartmentDTO> GetDepartmentById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ReadDepartmentDTO>> GetAllDepartmentsAsync()
    {
        var response = await _httpClient.GetAsync("api/Departments/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadDepartmentDTO>>();
            return responseData;
        }
        else
        {
            throw new InvalidOperationException("Failed to get roles.");
        }
    }

    public Task<ReadDepartmentDTO> UpdateDepartment(UpdateDepartmentDTO department)
    {
        throw new NotImplementedException();
    }

    public async Task<int> GetDepartmentCount()
    {
        var response = await _httpClient.GetAsync("api/Departments/count");
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

