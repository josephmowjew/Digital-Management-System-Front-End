using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations
{
    public class ReadLevyDeclarationDTO
    {
        public DateTime Month { get; set; }
        public decimal Revenue { get; set; }
        public decimal LevyAmount { get; set; }
        public decimal Percentage { get; set; }
        public int FirmId { get; set; }
        public ReadFirmDTO Firm { get; set; }
    }
}
