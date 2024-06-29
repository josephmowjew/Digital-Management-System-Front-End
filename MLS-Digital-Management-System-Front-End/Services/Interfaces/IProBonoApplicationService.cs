using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IProBonoApplicationService
    {
        Task<int> GetProBonoApplicationCountAsync();
    }
}
