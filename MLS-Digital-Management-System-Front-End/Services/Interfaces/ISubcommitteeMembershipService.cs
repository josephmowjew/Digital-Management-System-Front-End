using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ISubcommitteeMembershipService
    {
        Task<List<ReadUserDTO>> GetAllNonMembersAsync(int subcommitteeId);
    }
}
