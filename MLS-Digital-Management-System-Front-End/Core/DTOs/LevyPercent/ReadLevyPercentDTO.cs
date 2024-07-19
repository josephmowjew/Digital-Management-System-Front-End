using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyPercent
{
    public class ReadLevyPercentDTO
    {
        public int Id { get; set; }
        public decimal PercentageValue { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
    }
}
