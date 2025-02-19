using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Member;

  public class ReadMemberDTO
  {
    public int Id { get; set; }

    [Required]
    [MaxLength(250)]
    public string PostalAddress { get; set; }

    [Required]
    [MaxLength(250)] 
    public string PermanentAddress { get; set; }

    [Required]
    [MaxLength(250)]
    public string ResidentialAddress { get; set; }

    public string CustomerId { get; set; }

    [Required] 
    public DateOnly DateOfAdmissionToPractice { get; set; }

    public ReadUserDTO User { get; set; }

    public int? FirmId { get; set; }
    public ReadFirmDTO Firm { get; set; }
    //public List<ReadLicenseDTO> Licenses { get; set; }
    //public ReadLicenseDTO CurrentLicense { get; set; }
    
  }