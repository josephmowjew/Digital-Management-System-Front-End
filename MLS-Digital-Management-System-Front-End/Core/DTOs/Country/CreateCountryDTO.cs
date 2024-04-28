using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Country;

public class CreateCountryDTO
{

    [StringLength(maximumLength: 100, MinimumLength = 2)]
    [Display(Name = "Name")]
    public string Name { get; set; }
    [Required]
    [StringLength(maximumLength:10,MinimumLength =2)]
    [Display(Name = "Short Code")]
    public string ShortCode { get; set; }
    public string DataInvalid { get; set; } = "true";
}