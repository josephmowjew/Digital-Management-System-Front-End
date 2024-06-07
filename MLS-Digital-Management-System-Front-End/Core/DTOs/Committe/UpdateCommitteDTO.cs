
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;

public class UpdateCommitteeDTO
{
    public int Id { get; set; }

    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    [Display(Name = "Committee Name")]
    public string CommitteeName { get; set; }

    [StringLength(maximumLength: 500)]
    [Display(Name = "Description")]
    public string Description { get; set; }

    [Display(Name = "Creation Date")]
    public DateTime CreationDate { get; set; }

    [Display(Name = "Chairperson")]
    public int? ChairpersonID { get; set; }

    [Display(Name = "Year of Operation")]
    public int YearOfOperationId { get; set; }
    
}
