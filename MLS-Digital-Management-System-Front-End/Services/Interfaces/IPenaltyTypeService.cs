using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;
using MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyType;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IPenaltyTypeService
    {
        Task<List<ReadPenaltyTypeDTO>> GetAllPenaltyTypesAsync();
    }
}
