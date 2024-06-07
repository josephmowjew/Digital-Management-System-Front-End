using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IPenaltyService
    {
        Task<List<ReadPenaltyDTO>> GetAllPenaltiesAsync();
    }
}
