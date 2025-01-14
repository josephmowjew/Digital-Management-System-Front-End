using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.InstitutionType;

public class CreateInstitutionTypeDTO{
    [Required]
    [StringLength(maximumLength: 150)]
    public string Name { get; set; }
    public string DataInvalid { get; set; } = "true";
}