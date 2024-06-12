using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;


public class CommitteeMemberDTO
{
    
    public string CommitteeId { get; set; }
    [Required]
    [Display(Name = "Committe Member Name")]
    public string MemberShipId { get; set; }
    [Required]
    [StringLength(maximumLength:100)]
    public  string  Role { get; set; }
}