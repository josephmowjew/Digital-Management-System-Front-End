using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;

public class CreateSubcommitteeDTO
{
    [Required(ErrorMessage = "The SubcommitteeName field is required")]
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    [Display(Name = "Subcommittee Name")]
    public string SubcommitteeName { get; set; }

    [StringLength(maximumLength: 500)]
    [Display(Name = "Description")]
    public string Description { get; set; }

    public int? ChairpersonID { get; set; }

    [Display(Name = "Practicing Year")]
    public int YearOfOperationId { get; set; }

    public int CommitteeId { get; set; }
}
