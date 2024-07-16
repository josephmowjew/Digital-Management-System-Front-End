using MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface ILevyDeclarationService
    {
        Task<List<ReadLevyDeclarationDTO>> GetAllLevyDeclarationsAsync();
        Task<int> GetLevyDeclarationsCountAsync();
    }
}

