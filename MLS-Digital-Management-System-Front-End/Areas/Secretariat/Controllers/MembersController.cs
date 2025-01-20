
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Area("Secretariat")]
    public class MembersController : Controller
    {
        private readonly IServiceRepository _service;

        public MembersController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public async Task<IActionResult> Index()
        {
            await PopulateViewBags();
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> MembersWithMissingRecords()
        {
            await PopulateViewBags();

            return View();
        }
        public async Task<IActionResult> MemberDetails(string id)
        {
            await PopulateViewBags();
            var member = await _service.MemberService.GetMemberByUserIdAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            ViewBag.member = member;

            return View();
        }

        public async Task<IActionResult> LicensedMembers()
        {
            await PopulateViewBags();
            return View();
        }

        public async Task<IActionResult> UnlicensedMembers()
        {
            await PopulateViewBags();
            return View();
        }

        private async Task PopulateViewBags()
        {
            await PopulateViewBagsMinimal();
        }

        

        private async Task PopulateViewBagsMinimal()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            _service.Token = token;
            ViewBag.identityTypesList = await GetIdentityTypes();
            ViewBag.personalTitlesList = await GetPersonalTitles();
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
