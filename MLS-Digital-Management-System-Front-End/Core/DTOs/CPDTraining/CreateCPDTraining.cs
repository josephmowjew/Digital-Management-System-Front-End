using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;

public class CreateCPDTrainingDTO
    {
        [Required]
        [StringLength(maximumLength: 100)]
        public string Title { get; set; }

        [StringLength(maximumLength: 250)]
        public string Description { get; set; }

        [Required]
        public double Duration { get; set; }

        [Required]
        [Display(Name = "Date To Be Conducted")]
        public DateTime DateToBeConducted { get; set; }

        [Required]
        [Display(Name = "Proposed Units")]
        public int ProposedUnits { get; set; }
        [Display(Name = "Training Fee (MWK)")]
        public double? TrainingFee { get; set; }

        [Required]
        [Display(Name = "CPD Units Awarded")]
        public int CPDUnitsAwarded { get; set; }

        [StringLength(maximumLength: 200)]
        [Display(Name = "Accrediting Institution")]
        public string? AccreditingInstitution { get; set; }

        public List<IFormFile?> Attachments = new List<IFormFile>();
    }