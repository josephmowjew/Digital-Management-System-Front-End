
namespace MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTrainingRegistration;
using System.ComponentModel.DataAnnotations;

public class CreateCPDTrainingRegistrationDTO
{
    public int CPDTrainingId { get; set; }
    [Display(Name = "Upload Proof of Payment")]
    public List<IFormFile?> Attachments { get; set; }
}