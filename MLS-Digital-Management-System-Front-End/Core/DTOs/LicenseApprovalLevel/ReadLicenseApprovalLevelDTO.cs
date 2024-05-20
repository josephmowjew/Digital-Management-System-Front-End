

using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Department;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalLevel;
public class ReadLicenseApprovalLevelDTO
{
    public int Id { get; set; }
    public int Level { get; set; }
    public int DepartmentId { get; set; }
    public ReadDepartmentDTO Department { get; set; }
}