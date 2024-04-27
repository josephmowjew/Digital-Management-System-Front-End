using System;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation
{
    public class UpdateYearOfOperationDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Start Date")]
        public DateOnly StartDate { get; set; }

        [Required]
        [Display(Name = "End Date")]
        public DateOnly EndDate { get; set; }
        public string DataInvalid { get; set; } = "true";
    }
}