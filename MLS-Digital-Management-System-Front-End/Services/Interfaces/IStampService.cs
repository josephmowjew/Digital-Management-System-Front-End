using MLS_Digital_Management_System_Front_End.Core.DTOs.Stamp;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IStampService
{
    Task<ReadStampDTO> GetStampByIdAsync(int stampId);
    Task<ReadStampDTO> GetStampByNameAsync(string name);
}
