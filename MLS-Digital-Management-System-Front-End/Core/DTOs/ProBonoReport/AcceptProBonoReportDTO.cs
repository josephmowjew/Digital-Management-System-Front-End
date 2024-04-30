using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoReport;

public class AcceptProBonoReportDTO
{
    public int Id { get; set; }
    [Display(Name = "Probono Identification Number")]
    public int ProBonoReportId { get; set; }

    [Display(Name = "Report Proposed Hours")]
    public double ProBonoProposedHours { get; set; }
    [Required]
     public double ProBonoHours { get; set; }
    public string Description { get; set; }
}