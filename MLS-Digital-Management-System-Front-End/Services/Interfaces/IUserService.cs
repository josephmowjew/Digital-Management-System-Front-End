using System.Threading.Tasks;
using Core.Models;
using MLS_Digital_Management_System_Front_End.Core.DTOs.IdentityType;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IUserService{

    Task<CreateUserDTO> CreateUserAsync(CreateUserDTO user);
    Task<List<ReadUserDTO>> GetAllUsersAsync();
    Task<ReadUserDTO> GetUserByIdAsync(string id);

    

    
    
}