using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ILicenseApplicationService
{
    Task<bool> CheckIfPreviousApplicationExists(string userId);
    Task<ReadLicenseApplicationDTO> GetLicenseApplication(int id);
    Task<int> GetLicenseApplicationsTotal();
}
