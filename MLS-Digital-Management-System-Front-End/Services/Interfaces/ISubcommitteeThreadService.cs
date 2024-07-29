using MLS_Digital_Management_System_Front_End.Core.DTOs.SubcommitteeThread;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ISubcommitteeThreadService
{
    Task<List<ReadSubcommitteeThreadDTO>> GetAllSubcommitteeThreadsAsync();
    Task<ReadSubcommitteeThreadDTO> GetSubcommitteeThreadByIdAsync(int id);
    //Task<ReadThreadDTO> AddSubcommitteeThread(CreateThreadDTO createThreadDTO);
}
