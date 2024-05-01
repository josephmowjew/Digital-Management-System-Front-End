using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.MemberQualification;


  public class UpdateMemberQualificationDTO
  {
    public int Id { get; set; }

    [Required]
    [StringLength(250)]
    public string Name { get; set; }

    public int MemberId { get; set; }

    [Required]
    [StringLength(250)] 
    [Display(Name = "Issuing Institution")]
    public string IssuingInstitution { get; set; }
    [Display(Name = "Date Obtained")]
    public DateTime DateObtained { get; set; }
    [Display(Name = "Qualification Type")]
    public int QualificationTypeId { get; set; }

    public ICollection<IFormFile>? Attachments { get; set; }  
  }