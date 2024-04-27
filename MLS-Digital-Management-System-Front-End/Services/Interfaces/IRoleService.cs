using MLS_Digital_Management_System_Front_End.Core.DTOs.Role;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IRoleService
{
    Task<List<ReadRoleDTO>> GetAllRolesAsync();
    Task<ReadRoleDTO> GetRoleByIdAsync(int id);
    Task<ReadRoleDTO> AddRole(CreateRoleDTO createRoleDTO);
}