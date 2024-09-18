namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IServiceRepository{

    public string Token { get; set; }
    IUserService UserService { get; }
    IIdentityTypeService IdentityTypeService {get; }
    ITitleService TitleService { get; }
    IRoleService RoleService { get; }
    IDepartmentService DepartmentService { get; }
    IAuthenticationService AuthenticationService { get; }
    ICountryService CountryService { get; }
    IProBonoClientService ProbonoClientService { get; }
    IYearOfOperationService YearOfOperationService { get; }
    IMemberService MemberService { get; }
    IQualificationTypeService QualificationTypeService { get; }
    IFirmService FirmService { get; }
    ILicenseService LicenseService { get; }
    ILicenseApplicationService LicenseApplicationService{ get; }
    ILicenseApprovalHistoryService LicenseApprovalHistoryService { get; }
    ICpdUnitsEarnedService CpdUnitsEarnedService { get; }
    ICpdTrainingService CpdTrainingService { get; }
    ICpdTrainingRegistrationService CpdTrainingRegistrationService { get; }
    IPenaltyTypeService PenaltyTypeService { get; }
    IPenaltyService PenaltyService { get; }
    IThreadService ThreadService { get; }
    IPenaltyPaymentService PenaltyPaymentService { get; }
    ICommitteeMembershipService CommitteeMembershipService { get; }
    ICommitteeService CommitteeService { get; } 
    IProBonoApplicationService ProBonoApplicationService { get; }
    IProBonoReportService ProBonoReportService { get; }
    IProBonoService ProBonoService { get; }
    IInvoiceRequestService InvoiceRequestService { get; }
    ILevyDeclarationService LevyDeclarationService { get; }
    ILevyPercentService LevyPercentService { get; }
    ISubcommitteeMembershipService SubcommitteeMembershipService { get; }
    ISubcommitteeService SubcommitteeService { get; }
    ISubcommitteeThreadService SubcommitteeThreadService { get; }
    IStampService StampService { get; }
    ISignatureService SignatureService { get; }
}

