using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Stamp;

public class CreateStampDTO
{
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    public string Name { get; set; }

    [Required]
    [Display(Name = "Practicing Year")]
    public int YearOfOperationId { get; set; }
    
    [Display(Name = "Attachment")]
    public List<IFormFile>? Attachments { get; set; }
}