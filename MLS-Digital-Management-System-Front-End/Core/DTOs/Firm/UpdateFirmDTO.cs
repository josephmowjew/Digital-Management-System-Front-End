using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;

public class UpdateFirmDTO
{
    public int Id { get; set; }
    [Required]
    [StringLength(maximumLength: 100)]
    [Display(Name = "Firm Name")]
    public string Name { get; set; }

    [Required]
    [StringLength(maximumLength: 250)]
    [Display(Name = "Postal Address")]
    public string PostalAddress { get; set; }

    [Required]
    [StringLength(maximumLength: 250)]
    [Display(Name = "Physical Address")]
    public string PhysicalAddress { get; set; }

    [Required]
    [StringLength(maximumLength: 100)]
    [Display(Name = "Primary Contact Person")]
    public string PrimaryContactPerson { get; set; }

    [Required]
    [StringLength(maximumLength: 15)]
    [Display(Name = "Primary Phone Number")]
    public string PrimaryPhoneNumber { get; set; }

    [StringLength(maximumLength: 100)]
    [Display(Name = "Secondary Contact Person")]
    public string SecondaryContactPerson { get; set; }

    [StringLength(maximumLength: 15)]
    [Display(Name = "Secondary Phone Number")]
    public string SecondaryPhoneNumber { get; set; }
    
    [Display(Name = "Customer QuickBooks Id")]
    public string CustomerId { get; set; }

    public string DataInvalid { get; set; } = "true";
}