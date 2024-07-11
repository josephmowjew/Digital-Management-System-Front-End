using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations
{
    public class CreateLevyDeclarationDTO
    {
        public DateTime Month { get; set; }
        public int FirmId { get; set; }
        public decimal Revenue { get; set; }
        [Range(0, double.MaxValue, ErrorMessage = "Levy amount must be greater than or equal to 0")]
        public decimal LevyAmount { get; set; }
        [Range(0, 100, ErrorMessage = "Percentage must be between 0 and 100")]
        public decimal Percentage { get; set; }
    }
}
