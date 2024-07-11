using MLS_Digital_Management_System_Front_End.Core.DTOs.LevyPercent;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ILevyPercentService
    {
        Task<List<ReadLevyPercentDTO>> GetAllLevyPercentsAsync();
        Task<int> GetLevyPercentsCountAsync();
    }
}
