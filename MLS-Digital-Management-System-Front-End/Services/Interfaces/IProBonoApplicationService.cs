using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IProBonoApplicationService
{

    Task<List<ReadProBonoClientDTO>> GetAllProBonoClientsByMemberIdAsync();
}