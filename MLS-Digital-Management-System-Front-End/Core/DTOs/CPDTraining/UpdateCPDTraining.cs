using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;

public class UpdateCPDTrainingDTO
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        public double Duration { get; set; }

        [Display(Name = "Training Fee (MWK)")]
        public double? TrainingFee { get; set; }
        public DateTime DateToBeConducted { get; set; }
        public int ProposedUnits { get; set; }
        public int CPDUnitsAwarded { get; set; }
        [StringLength(200)]
        public string? AccreditingInstitution { get; set; }
        public List<IFormFile> Attachments = new List<IFormFile>();
    }