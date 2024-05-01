using MLS_Digital_Management_System_Front_End.Core.DTOs.QualificationType;
using MLS_Digital_Management_System_Front_End.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IQualificationTypeService
    {
        Task<IEnumerable<ReadQualificationTypeDTO>> GetAllAsync();
        Task<ReadQualificationTypeDTO> GetByIdAsync(int id); 
        Task<ReadQualificationTypeDTO> AddAsync(CreateQualificationTypeDTO qualificationType);
        Task<ReadQualificationTypeDTO> UpdateAsync(UpdateQualificationTypeDTO qualificationType);
        Task DeleteAsync(int id);
    }
}
