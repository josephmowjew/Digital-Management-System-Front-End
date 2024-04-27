
using MLS_Digital_Management_System_Front_End.Core.DTOs.IdentityType;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IIdentityTypeService
{

    Task<List<ReadIdentityTypeDTO>> GetAllIdentityTypesAsync();
    Task<ReadIdentityTypeDTO> GetIdentityTypeByIdAsync(int id);
    Task<ReadIdentityTypeDTO> AddIdentityType(CreateIdentityTypeDTO identityType);

}