using System.Net.Http.Headers;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

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


    public string Token 
    { 
        get { return _httpClient.DefaultRequestHeaders.Authorization.Parameter; } 
        set 
        { 
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", value);
            // Create a new HttpClient instance with the token
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://localhost:5043");
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
        } 
    } 


    public ServiceRepository(IHttpClientFactory httpClientFactory)
    {
        this._httpClient = httpClientFactory.CreateClient();
        _httpClient.BaseAddress = new Uri("http://localhost:5043");
       
      
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