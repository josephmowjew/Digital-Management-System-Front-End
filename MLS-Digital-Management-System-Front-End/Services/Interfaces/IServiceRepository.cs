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

}