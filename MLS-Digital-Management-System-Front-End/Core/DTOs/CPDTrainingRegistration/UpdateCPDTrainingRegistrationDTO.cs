
namespace MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTrainingRegistration;
using System.ComponentModel.DataAnnotations;

public class UpdateCPDTrainingRegistrationDTO
{
    public int Id { get; set; }
    public int CPDTrainingId { get; set; }
    public List<IFormFile?> Attachments { get; set; }
}