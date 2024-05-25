using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ILicenseApprovalHistoryService
{
    Task<List<ReadLicenseApprovalHistoryDTO>> GetLicenseApprovalHistoryByIdAsync(int id);
}
