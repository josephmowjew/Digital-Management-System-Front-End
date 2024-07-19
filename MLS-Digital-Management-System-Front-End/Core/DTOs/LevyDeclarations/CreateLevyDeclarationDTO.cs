using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations
{
    public class CreateLevyDeclarationDTO
    {
        public DateTime Month { get; set; }
        public int FirmId { get; set; }
        public decimal Revenue { get; set; }
        public List<IFormFile>? Attachments { get; set; }
        
    }
}
