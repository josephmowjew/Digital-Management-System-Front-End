using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;

    public class CreateLicenseApplicationDTO
    {
        public int Id {get; set;}
        public int YearOfOperationId { get; set; }
        public bool PerformedFullMandatoryProBonoWork { get; set; }
        public IFormFile? PerformedFullMandatoryProBonoWorkAttachment { get; set; }
        [StringLength(maximumLength: 250)] 
        [Required]
        public string ApplicationStatus { get; set; }
        public int CurrentApprovalLevelID { get; set; }
        public bool FirstApplicationForLicense { get; set; }
        public bool RenewedLicensePreviousYear { get; set; }
        public bool ObtainedLeaveToRenewLicenseOutOfTime { get; set; }
        public IFormFile? ObtainedLeaveToRenewLicenseOutOfTimeAttachment {get; set;}
        public bool PaidAnnualSubscriptionToSociety { get; set; }
        public string? ExplanationForNoAnnualSubscriptionToSociety { get; set; }
        public IFormFile? PaidAnnualSubscriptionToSocietyAttachment { get; set; }  
        public bool MadeContributionToFidelityFund { get; set; }
        public IFormFile? MadeContributionToFidelityFundAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoContributionToFidelityFund { get; set; }
        public bool RemittedSocietysLevy { get; set; }
        public IFormFile? RemittedSocietysLevyAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoSocietysLevy { get; set; }
        public bool MadeContributionToMLSBuildingProjectFund { get; set; }
        public IFormFile? MadeContributionToMLSBuildingProjectFundAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoContributionToMLSBuildingProjectFund { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoFullMandatoryProBonoWork { get; set; }
        public bool AttainedMinimumNumberOfCLEUnits { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoMinimumNumberOfCLEUnits { get; set; }
        public IFormFile? AttainedMinimumNumberOfCLEUnitsAttachment { get; set; }
        public bool HasValidAnnualProfessionalIndemnityInsuranceCover { get; set; }
        public IFormFile? HasValidAnnualProfessionalIndemnityInsuranceCoverAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoProfessionalIndemnityInsuranceCover { get; set; }
        public bool SubmittedValidTaxClearanceCertificate { get; set; }
        public IFormFile? SubmittedValidTaxClearanceCertificateAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoValidTaxClearanceCertificate { get; set; }
        public bool SubmittedAccountantsCertificate { get; set; }
        public IFormFile? SubmittedAccountantsCertificateAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoAccountantsCertificate { get; set; }
        public bool CompliedWithPenaltiesImposedUnderTheAct { get; set; }
        public IFormFile? CompliedWithPenaltiesImposedUnderTheActAttachment { get; set; }
        [StringLength(maximumLength: 250)]
        public string ExplanationForNoComplianceWithPenalties { get; set; }
        [Display(Name = "Firm")]
        public int FirmId { get; set; }
        public bool CertificateOfAdmission {get; set;}
         public IFormFile? CertificateOfAdmissionAttachment {get; set;}
        public string? ExplanationForNotSubmittingCertificateOfAdmission {get; set;}
    }
