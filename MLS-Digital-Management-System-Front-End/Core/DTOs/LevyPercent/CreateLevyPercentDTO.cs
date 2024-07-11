using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyPercent
{
    public class CreateLevyPercentDTO
    {
        [Range(0, double.MaxValue, ErrorMessage = "Percentage value must be greater than or equal to 0")]
        public double PercentageValue { get; set; }
    }
}
