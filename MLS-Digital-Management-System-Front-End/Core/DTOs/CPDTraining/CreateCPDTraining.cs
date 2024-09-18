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
        [Display(Name = "Duration (in hours)")]
        public double Duration { get; set; }

        [Required]
        [Display(Name = "Date To Be Conducted")]
        public DateTime DateToBeConducted { get; set; }
        [Display(Name = "Registration Due Date")]
        [DataType(DataType.Date)]
        public DateTime? RegistrationDueDate { get; set; }
        [Required]
        [Display(Name = "Proposed Units")]
        public int ProposedUnits { get; set; }
        [Display(Name="Member Physical Attendance Fee (MWK)")]
        public double? MemberPhysicalAttendanceFee { get; set; } 
        [Display(Name = "Member Virtual Attendance Fee (MWK)")]
        public double? MemberVirtualAttendanceFee { get; set; } 
        [Display(Name = "Non-Member Physical Attendance Fee (MWK)")]
        public double? NonMemberPhysicalAttendanceFee { get; set; } 
        [Display(Name = "Non-Member Virtual Attendance Fee (MWK)")]
         public double? NonMemberVirtualAttandanceFee { get; set; }
        [Display(Name = "Physical Venue")]
        [StringLength(maximumLength:250)]
        public string? PhysicalVenue { get; set; }
        [Required]
        [Display(Name = "CPD Units Awarded")]
        public int CPDUnitsAwarded { get; set; }

        [StringLength(maximumLength: 200)]
        [Display(Name = "Accrediting Institution")]
        public string? AccreditingInstitution { get; set; }
        [Display(Name = "Poster")]
        public List<IFormFile?> Attachments = new List<IFormFile>();

        public string? AccreditingInstitutionRepresentativePosition { get; set; }
    }