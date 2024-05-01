using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;


namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IServiceRepository _service;
        public HomeController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public IActionResult Index()
        {   
    
            return View();
        }

        public async Task<IActionResult> Profile()
        {

           

            await PopulateViewBags();

            ViewBag.userId = HttpContext.Request.Cookies["UserId"];

            return View();
        }


        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            //get identity types
            ViewBag.identityTypesList = await GetIdentityTypes();
            ViewBag.personalTitlesList = await GetPersonalTitles();
            ViewBag.rolesList = await GetRoles();
            ViewBag.departmentsList = await GetDepartments();
            ViewBag.countriesList = await GetCountries();
        }
        
        private async Task<List<SelectListItem>> GetIdentityTypes()
        {
            List<SelectListItem> identityTypes = new() { new SelectListItem() { Text = "---Select Identity Type---", Value = "" } };

            //get identity types from remote
            var identityTypesFromRemote =  await this._service.IdentityTypeService.GetAllIdentityTypesAsync();

            if (identityTypesFromRemote != null)
            {
                identityTypesFromRemote.ForEach(idType =>
                {
                    identityTypes.Add(new SelectListItem() { Text = idType.Name, Value = idType.Id.ToString() });
                });
            }

            return identityTypes;
        }

        private async Task<List<SelectListItem>> GetPersonalTitles()
        {
            List<SelectListItem> personalTitlesList = new() { new SelectListItem() { Text = "---Select Title---", Value = "" } };
            //get identity types from remote
            var titlesFromRemote =  await this._service.TitleService.GetAllTitlesAsync();

            if (titlesFromRemote != null)
            {
                titlesFromRemote.ForEach(title =>
                {
                    personalTitlesList.Add(new SelectListItem() { Text = title.Name, Value = title.Id.ToString() });
                });
            }
            return personalTitlesList;
        }

        private async Task<List<SelectListItem>> GetRoles()
        {
            List<SelectListItem> rolesList = new() { new SelectListItem() { Text = "---Select Role---", Value = "" } };
            //get identity types from remote
            var rolesFromRemote =  await this._service.RoleService.GetAllRolesAsync();

            if (rolesFromRemote != null)
            {
                rolesFromRemote.ForEach(role =>
                {
                    rolesList.Add(new SelectListItem() { Text = role.Name, Value = role.Name.ToString() });
                });
            }
            return rolesList;
        }

        private async Task<List<SelectListItem>> GetDepartments()
        {
            List<SelectListItem> departmentsList = new() { new SelectListItem() { Text = "---Select Departments---", Value = "" } };
            //get identity types from remote
            var departmentsFromRemote =  await this._service.DepartmentService.GetAllDepartmentsAsync();

            if (departmentsFromRemote != null)
            {
                departmentsFromRemote.ForEach(department =>
                {
                    departmentsList.Add(new SelectListItem() { Text = department.Name, Value = department.Id.ToString() });
                });
            }
            return departmentsList;
        }
        private async Task<List<SelectListItem>> GetCountries()
        {
            List<SelectListItem> countriesList = new() { new SelectListItem() { Text = "---Select Country---", Value = "" } };
            //get countries  from remote
            var countriesFromRemote =  await this._service.CountryService.GetCountries();

            if (countriesFromRemote != null)
            {
                countriesFromRemote.ForEach(country =>
                {
                    countriesList.Add(new SelectListItem() { Text = country.Name, Value = country.Id.ToString() });
                });
            }
            return countriesList;
        }


       
    
    }
}
