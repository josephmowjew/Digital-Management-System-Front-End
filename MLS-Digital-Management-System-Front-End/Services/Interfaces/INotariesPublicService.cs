
using MLS_Digital_Management_System_Front_End.Core.DTOs.NotariesPublic;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface INotariesPublicService
    {
        Task<List<ReadNotariesPublicDTO>> GetAllNotariesPublicAsync();
        Task<int> GetNotariesPublicCountAsync();
        Task<ReadNotariesPublicDTO> GetNotaryPublicByMemberIdAsync(int memberId);
    }
}
