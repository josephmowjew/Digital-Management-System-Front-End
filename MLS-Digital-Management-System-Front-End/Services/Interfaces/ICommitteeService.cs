using MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ICommitteeService
    {
        Task<ReadCommitteeDTO> GetCommitteeByIdAsync(int id);
    }
}
