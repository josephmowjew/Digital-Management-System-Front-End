using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Stamp;

public class UpdateStampDTO
{
    public int Id { get; set; }
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    public string Name { get; set; }

    [Required]
    [Display(Name = "Practicing Year")]
    public int YearOfOperationId { get; set; }
    
    [Display(Name = "Attachment")]
    public List<IFormFile>? Attachments { get; set; }
}