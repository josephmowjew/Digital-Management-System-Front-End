using System.Net.Http.Headers;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class ServiceRepository : IServiceRepository
{
    private readonly HttpClient _httpClient;
    private  IUserService _userService;
    private  IIdentityTypeService _identityTypeService;
    private ITitleService _titleService;
    private IRoleService _roleService;
    private IDepartmentService _departmentService;
    private IAuthenticationService _authenticationService;
    private ICountryService _countryService;
    private IProBonoClientService _probonoClientService;
    private IYearOfOperationService _yearOfOperationService;


    public string Token { get; set; }

    public ServiceRepository(IHttpClientFactory httpClientFactory)
    {
        this._httpClient = httpClientFactory.CreateClient();
        _httpClient.BaseAddress = new Uri("http://localhost:5043");
      
        this._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
    }

    public IIdentityTypeService IdentityTypeService => _identityTypeService ??= new IdentityTypeService(_httpClient);
    public ITitleService TitleService => _titleService??= new TitleService(_httpClient);
    public IRoleService RoleService => _roleService ??= new RoleService(_httpClient);
    public IAuthenticationService AuthenticationService => _authenticationService ??= new AuthenticationService(_httpClient);
    public IUserService UserService => throw new NotImplementedException();
    public IDepartmentService DepartmentService => _departmentService ??= new DepartmentService(_httpClient);
    public ICountryService CountryService => _countryService ??= new CountryService(_httpClient);
    public IProBonoClientService ProbonoClientService => _probonoClientService ??= new ProBonoClientService(_httpClient);
    public IYearOfOperationService YearOfOperationService => _yearOfOperationService ??= new YearOfOperationService(_httpClient);

}