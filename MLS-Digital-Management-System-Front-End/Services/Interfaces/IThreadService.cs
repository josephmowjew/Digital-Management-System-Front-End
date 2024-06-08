using MLS_Digital_Management_System_Front_End.Core.DTOs.Thread;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IThreadService
{
    Task<List<ReadThreadDTO>> GetAllThreadsAsync();
    Task<ReadThreadDTO> GetThreadByIdAsync(int id);
    //Task<ReadThreadDTO> AddThread(CreateThreadDTO createThreadDTO);
}
