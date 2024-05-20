using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalLevel;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;

public class ReadLicenseApplicationDTO
    {
        public int Id { get; set; }
        public int YearOfOperationId { get; set; }
        public string ApplicationStatus { get; set; } 
        public int CurrentApprovalLevelID { get; set; }
        public  ReadLicenseApprovalLevelDTO CurrentApprovalLevel { get; set; }
        public int MemberId { get; set; }
        public ReadMemberDTO Member { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; } 
        public List<ReadAttachmentDTO> Attachments { get; set; } = new List<ReadAttachmentDTO>();



        // Extra properties
        public bool FirstApplicationForLicense { get; set; }
        public bool RenewedLicensePreviousYear { get; set; }
        public bool ObtainedLeaveToRenewLicenseOutOfTime { get; set; }
        public bool PaidAnnualSubscriptionToSociety { get; set; }
        public string? ExplanationForNoAnnualSubscriptionToSociety { get; set; }
        public bool MadeContributionToFidelityFund { get; set; }
        public string ExplanationForNoContributionToFidelityFund { get; set; }
        public bool RemittedSocietysLevy { get; set; }
        public string ExplanationForNoSocietysLevy { get; set; }
        public bool MadeContributionToMLSBuildingProjectFund { get; set; }
        public string ExplanationForNoContributionToMLSBuildingProjectFund { get; set; }
        public bool PerformedFullMandatoryProBonoWork { get; set; }
        public string ExplanationForNoFullMandatoryProBonoWork { get; set; }
        public bool AttainedMinimumNumberOfCLEUnits { get; set; }
        public string ExplanationForNoMinimumNumberOfCLEUnits { get; set; }
        public bool HasValidAnnualProfessionalIndemnityInsuranceCover { get; set; }
        public string ExplanationForNoProfessionalIndemnityInsuranceCover { get; set; }
        public bool SubmittedValidTaxClearanceCertificate { get; set; }
        public string ExplanationForNoValidTaxClearanceCertificate { get; set; }
        public bool SubmittedAccountantsCertificate { get; set; }
        public string ExplanationForNoAccountantsCertificate { get; set; }
        public bool CompliedWithPenaltiesImposedUnderTheAct { get; set; }
        public string ExplanationForNoComplianceWithPenalties { get; set; }
        
    }
