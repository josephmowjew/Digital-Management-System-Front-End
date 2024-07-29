using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;

public class CreateSubcommitteeMembershipDTO
{
    public string SubcommitteeId { get; set; }

    [Required]
    [Display(Name = "Subcommittee Member Name")]
    public string MembershipId { get; set; }

    [Required]
    [StringLength(maximumLength: 100)]
    public string Role { get; set; }
}
