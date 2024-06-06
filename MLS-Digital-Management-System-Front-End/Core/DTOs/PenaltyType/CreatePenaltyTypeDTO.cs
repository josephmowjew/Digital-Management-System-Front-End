using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyType
{
    public class CreatePenaltyTypeDTO
    {
        [Required]
        [StringLength(maximumLength: 100)]
        public string Name { get; set; }

        [Required]
        [StringLength(maximumLength: 250)]
        public string Description { get; set; }
    }
}
