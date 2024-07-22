using System.Net.Http.Headers;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;


namespace MLS_Digital_Management_System_Front_End.Services;

public class ServiceRepository : IServiceRepository
{
    private  HttpClient _httpClient;
    private  IUserService _userService;
    private  IIdentityTypeService _identityTypeService;
    private ITitleService _titleService;
    private IRoleService _roleService;
    private IDepartmentService _departmentService;
    private IAuthenticationService _authenticationService;
    private ICountryService _countryService;
    private IProBonoClientService _probonoClientService;
    private IYearOfOperationService _yearOfOperationService;
    private IMemberService _memberService;
    private IQualificationTypeService _qualificationTypeService;
    private IFirmService _firmService;
    private  IConfiguration _configuration;
    private ILicenseApplicationService _licenseApplicationService;
    private ILicenseApprovalHistoryService _licenseApprovalHistoryService;
    private ICpdUnitsEarnedService _cpdUnitsEarnedService;
    private ICpdTrainingService _cpdTrainingService;
    private ICpdTrainingRegistrationService _cpdTrainingRegistrationService;
    private IPenaltyTypeService _penaltyTypeService;
    private IPenaltyService _penaltyService;
    private IThreadService _threadService;
    private IPenaltyPaymentService _penaltyPaymentService;
    private ICommitteeMembershipService _committeeMembershipService;
    private ICommitteeService _committeeService;
    private IInvoiceRequestService _invoiceRequestService;
    private IProBonoApplicationService _proBonoApplicationService;
    private IProBonoReportService _proBonoReportService;
    private IProBonoService _proBonoService;
    private ILevyDeclarationService _levyDeclarationService;
    private ILevyPercentService _levyPercentService;
    private ISubcommitteeMembershipService _subcommitteeMembershipService;
    private ISubcommitteeService _subcommitteeService;


    public string Token 
    { 
        get { return _httpClient.DefaultRequestHeaders.Authorization.Parameter; } 
        set 
        { 
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", value);
            // Create a new HttpClient instance with the token
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("APIURL")["Link"]);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", value);

            // Update properties that rely on _httpClient
            _identityTypeService = new IdentityTypeService(_httpClient);
            _titleService = new TitleService(_httpClient);
            _roleService = new RoleService(_httpClient);
            _authenticationService = new AuthenticationService(_httpClient);
            _departmentService = new DepartmentService(_httpClient);
            _countryService = new CountryService(_httpClient);
            _probonoClientService = new ProBonoClientService(_httpClient);
            _yearOfOperationService = new YearOfOperationService(_httpClient);
            _memberService = new MemberService(_httpClient);
            _qualificationTypeService = new QualificationTypeService(_httpClient);
            _firmService = new FirmService(_httpClient);
            _licenseApplicationService = new LicenseApplicationService(_httpClient);
            _licenseApprovalHistoryService = new LicenseApprovalHistoryService(_httpClient);
            _cpdUnitsEarnedService = new CpdUnitsEarnedService(_httpClient);
            _cpdTrainingService = new CpdTrainingService(_httpClient);
            _cpdTrainingRegistrationService = new CpdTrainingRegistrationService(_httpClient);
            _penaltyService = new PenaltyService(_httpClient);
            _penaltyTypeService = new PenaltyTypeService(_httpClient);
            _threadService = new ThreadService(_httpClient);
            _penaltyPaymentService = new PenaltyPaymentService(_httpClient);
            _userService = new UserService(_httpClient);
            _committeeMembershipService = new CommitteeMembershipService(_httpClient);
            _committeeService = new CommitteeService(_httpClient);
            _proBonoApplicationService = new ProBonoApplicationService(_httpClient);
            _invoiceRequestService = new InvoiceRequestService(_httpClient);
            _proBonoReportService = new ProBonoReportService(_httpClient);
            _proBonoService = new ProBonoService(_httpClient);
            _levyDeclarationService = new LevyDeclarationService(_httpClient);
            _levyPercentService = new LevyPercentService(_httpClient);
            _subcommitteeMembershipService = new SubcommitteeMembershipService(_httpClient);
            _subcommitteeService = new SubcommitteeService(_httpClient);
        } 
    } 


    public ServiceRepository(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        this._httpClient = httpClientFactory.CreateClient();
        this._configuration = configuration;

        _httpClient.BaseAddress = new Uri(_configuration.GetSection("APIURL")["Link"]);
       
      
    }
    
    public IIdentityTypeService IdentityTypeService => _identityTypeService ??= new IdentityTypeService(_httpClient);
    public ITitleService TitleService => _titleService??= new TitleService(_httpClient);
    public IRoleService RoleService => _roleService ??= new RoleService(_httpClient);
    public IAuthenticationService AuthenticationService => _authenticationService ??= new AuthenticationService(_httpClient);
    public IUserService UserService => _userService??= new UserService(_httpClient);
    public IDepartmentService DepartmentService => _departmentService ??= new DepartmentService(_httpClient);
    public ICountryService CountryService => _countryService ??= new CountryService(_httpClient);
    public IProBonoClientService ProbonoClientService => _probonoClientService ??= new ProBonoClientService(_httpClient);
    public IYearOfOperationService YearOfOperationService => _yearOfOperationService ??= new YearOfOperationService(_httpClient);
    public IMemberService MemberService => _memberService ??= new MemberService(_httpClient);
    public IQualificationTypeService QualificationTypeService => _qualificationTypeService ??= new QualificationTypeService(_httpClient);
    public IFirmService FirmService => _firmService ??= new FirmService(_httpClient);
    public ILicenseApplicationService LicenseApplicationService => _licenseApplicationService ??= new LicenseApplicationService(_httpClient);
    public ILicenseApprovalHistoryService LicenseApprovalHistoryService => _licenseApprovalHistoryService ??= new LicenseApprovalHistoryService(_httpClient);
    public ICpdUnitsEarnedService CpdUnitsEarnedService => _cpdUnitsEarnedService ??= new CpdUnitsEarnedService(_httpClient);
    public ICpdTrainingService CpdTrainingService => _cpdTrainingService ??= new CpdTrainingService(_httpClient);
    public ICpdTrainingRegistrationService CpdTrainingRegistrationService => _cpdTrainingRegistrationService ??= new CpdTrainingRegistrationService(_httpClient);
    public IPenaltyService PenaltyService => _penaltyService ??= new PenaltyService(_httpClient);
    public IPenaltyTypeService PenaltyTypeService => _penaltyTypeService ??= new PenaltyTypeService(_httpClient);
    public IThreadService ThreadService => _threadService ??= new ThreadService(_httpClient);
    public IPenaltyPaymentService PenaltyPaymentService => _penaltyPaymentService ??= new PenaltyPaymentService(_httpClient);
    public ICommitteeMembershipService CommitteeMembershipService => _committeeMembershipService ??= new CommitteeMembershipService(_httpClient);
    public ICommitteeService CommitteeService => _committeeService ??= new CommitteeService(_httpClient);
    public IProBonoApplicationService ProBonoApplicationService => _proBonoApplicationService ??= new ProBonoApplicationService(_httpClient);
    public IProBonoReportService ProBonoReportService => _proBonoReportService ??= new ProBonoReportService(_httpClient);
    public IProBonoService ProBonoService => _proBonoService ??= new ProBonoService(_httpClient);
    public IInvoiceRequestService InvoiceRequestService => _invoiceRequestService ??= new InvoiceRequestService(_httpClient);
    public ILevyDeclarationService LevyDeclarationService => _levyDeclarationService ??= new LevyDeclarationService(_httpClient);
    public ILevyPercentService LevyPercentService => _levyPercentService ??= new LevyPercentService(_httpClient);
    public ISubcommitteeMembershipService SubcommitteeMembershipService => _subcommitteeMembershipService ??= new SubcommitteeMembershipService(_httpClient);
    public ISubcommitteeService SubcommitteeService => _subcommitteeService ??= new SubcommitteeService(_httpClient);
}