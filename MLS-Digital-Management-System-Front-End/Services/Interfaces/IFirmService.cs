using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IFirmService
{
    Task<List<ReadFirmDTO>> GetAllFirmsAsync();

}
