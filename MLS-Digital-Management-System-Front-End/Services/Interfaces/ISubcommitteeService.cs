using MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ISubcommitteeService
    {
        Task<ReadSubcommitteeDTO> GetSubcommitteeByIdAsync(int id);

        Task<int> GetSubcommitteesCountAsync();
    }
}
