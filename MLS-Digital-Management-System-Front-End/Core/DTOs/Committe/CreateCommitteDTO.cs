
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;

public class CreateCommitteeDTO
{
    [Required(ErrorMessage = "The CommitteeName field is required")]
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    [Display(Name = "Committee Name")]
    public string CommitteeName { get; set; }

    [StringLength(maximumLength: 500)]
    [Display(Name = "Description")]
    public string Description { get; set; }

    public int? ChairpersonID { get; set; }
    [Display(Name = "Practicing Year")]
    public int YearOfOperationId { get; set; }
}
