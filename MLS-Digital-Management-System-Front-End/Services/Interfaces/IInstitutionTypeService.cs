
using MLS_Digital_Management_System_Front_End.Core.DTOs.InstitutionType;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IInstitutionTypeService
{

    Task<List<ReadInstitutionTypeDTO>> GetAllInstitutionTypesAsync();
    Task<ReadInstitutionTypeDTO> GetInstitutionTypeByIdAsync(int id);
    Task<ReadInstitutionTypeDTO> AddInstitutionType(CreateInstitutionTypeDTO institutionType);

}