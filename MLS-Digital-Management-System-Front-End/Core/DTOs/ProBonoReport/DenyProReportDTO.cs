using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoReport;

public class DenyProReportDTO
{
    [Required]
    public int ProBonoReportId { get; set; }
    [Required, MaxLength(200)]
    public string Reason { get; set; }
}