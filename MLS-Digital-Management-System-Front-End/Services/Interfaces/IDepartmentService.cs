using MLS_Digital_Management_System_Front_End.Core.DTOs.Department;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IDepartmentService
{
    Task<List<ReadDepartmentDTO>> GetAllDepartmentsAsync();
    Task<ReadDepartmentDTO> GetDepartmentById(int id);
    Task<ReadDepartmentDTO> CreateDepartment(CreateDepartmentDTO department);
    Task<ReadDepartmentDTO> UpdateDepartment(UpdateDepartmentDTO department);
    Task<ReadDepartmentDTO> DeleteDepartment(int id);

    Task<int> GetDepartmentCount();

}