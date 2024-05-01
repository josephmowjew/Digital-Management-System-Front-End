using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.QualificationType;

 public class UpdateQualificationTypeDTO
{
    public string Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }
}