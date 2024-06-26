using MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ICommitteeMembershipService
    {
        Task<List<ReadUserDTO>> GetAllNonMembersAsync(int committeeId);
    }
}
