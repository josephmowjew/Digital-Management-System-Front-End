using MLS_Digital_Management_System_Front_End.Core.DTOs.License;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ILicenseService
{
    Task<ReadLicenseDTO> GetLicense(int id);
    Task<int> GetLicensesTotal();
    Task<ReadLicenseDTO> GetLicenseByNumber(string licenseNumber);
}
