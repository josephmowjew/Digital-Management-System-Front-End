using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Member;

  public class ReadMemberDTO
  {
    public string Id { get; set; }

    [Required]
    [MaxLength(250)]
    public string PostalAddress { get; set; }

    [Required]
    [MaxLength(250)] 
    public string PermanentAddress { get; set; }

    [Required]
    [MaxLength(250)]
    public string ResidentialAddress { get; set; }

    [Required] 
    public DateOnly DateOfAdmissionToPractice { get; set; }
    
  }