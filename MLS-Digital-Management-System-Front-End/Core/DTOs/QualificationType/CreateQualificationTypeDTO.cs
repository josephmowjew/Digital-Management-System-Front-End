using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.QualificationType;

 public class CreateQualificationTypeDTO
{
    [Required]
    [StringLength(maximumLength: 100)]
    public string Name { get; set; }
}