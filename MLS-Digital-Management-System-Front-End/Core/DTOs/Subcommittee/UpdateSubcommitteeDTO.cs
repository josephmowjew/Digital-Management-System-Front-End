using System;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;

public class UpdateSubcommitteeDTO
{
    public int Id { get; set; }

    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    [Display(Name = "Subcommittee Name")]
    public string SubcommitteeName { get; set; }

    [StringLength(maximumLength: 500)]
    [Display(Name = "Description")]
    public string Description { get; set; }

    [Display(Name = "Creation Date")]
    public DateTime CreationDate { get; set; }

    [Display(Name = "Chairperson")]
    public int? ChairpersonID { get; set; }

    [Display(Name = "Practicing Year")]
    public int YearOfOperationId { get; set; }

    [Display(Name = "Parent Committee")]
    public int ParentCommitteeId { get; set; }
}
