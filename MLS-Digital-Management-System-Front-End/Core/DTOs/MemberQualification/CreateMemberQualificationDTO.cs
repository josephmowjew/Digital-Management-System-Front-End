using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.MemberQualification;


 public class CreateMemberQualificationDTO
  {
    [Required]
    [StringLength(maximumLength:250)]
    public string Name { get; set; }
    [Required]
    [StringLength(maximumLength: 250)]

    [Display(Name = "Issuing Institution")]
    public string IssuingInstitution { get; set; }

    [Required]
    [Display(Name = "Date Obtained")]
    public DateTime DateObtained { get; set; }

    [Required]
    public int MemberId { get; set; }

    [Required]
    [Display(Name = "Qualification Type")]
    public int QualificationTypeId { get; set; }

    public ICollection<IFormFile>? Attachments { get; set; }  
  }