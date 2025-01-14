using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.InstitutionType;

public class UpdateInstitutionTypeDTO
{
    public int Id { get; set; }
    [Required]
    [StringLength(maximumLength: 100)]
    public string Name { get; set; }
}