using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoReport;

public class UpdateProBonoReportDTO
{
     public int Id { get; set; }
    [Display(Name = "Probono Identification Number")]
    public int ProBonoId { get; set; }

    [Required]
    [Display(Name = "Report Proposed Hours")]
    public double ProBonoProposedHours { get; set; }

    [StringLength(250)]
    public string Description { get; set; }

    public ICollection<IFormFile>? Attachments { get; set; }
   
}