using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IProBonoClientService
{

    Task<List<ReadProBonoClientDTO>> GetAllProBonoClientsAsync();

    Task<ReadProBonoClientDTO> GetProBonoClientByIdAsync(int id);

    Task<ReadProBonoClientDTO> CreateProBonoClientAsync(CreateProBonoClientDTO createProBonoClientDTO);

    Task<ReadProBonoClientDTO> UpdateProBonoClientAsync(UpdateProBonoClientDTO updateProBonoClientDTO);

    Task<int> GetClientsCountAsync();
}