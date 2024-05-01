using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Member;

  public class CreateMemberDTO
  {
    
    [Display(Name = "User Id")]
    public string UserId { get; set; }
    [Required, MaxLength(250)]
    [Display(Name = "Postal Address")]
    public string PostalAddress { get; set; }

    [Display(Name = "Permanent Address")]
    [Required, MaxLength(250)]
    public string PermanentAddress { get; set; }

    [Required, MaxLength(250)] 
    [Display(Name = "Residential Address")]
    public string ResidentialAddress { get; set; }

    [Required]
    [Display(Name = "Date Of Admission To Practice")]
    public DateOnly DateOfAdmissionToPractice { get; set; }

  }