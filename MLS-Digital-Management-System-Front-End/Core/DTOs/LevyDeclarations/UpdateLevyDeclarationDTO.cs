using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations
{
    public class UpdateLevyDeclarationDTO
    {
        public int Id { get; set; }
        public DateTime Month { get; set; }
        public decimal Revenue { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
