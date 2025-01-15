using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Authorize]
    [Area("Secretariat")]
    public class FirmsController : Controller
    {
         private readonly IServiceRepository _service;
         public FirmsController(IServiceRepository serviceRepository)
         {
             _service = serviceRepository;
         }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();
            return View();

        }


         private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.institutionTypesList = await GetInstitutionTypes();
        }

        private async Task<List<SelectListItem>> GetInstitutionTypes()
        {
            List<SelectListItem> institutionTypes = new() { new SelectListItem() { Text = "---Select Institution Type---", Value = "" } };

            //get institution types from remote
            var institutionTypesFromRemote =  await this._service.InstitutionTypeService.GetAllInstitutionTypesAsync();

            if (institutionTypesFromRemote != null)
            {
                institutionTypesFromRemote.ForEach(idType =>
                {
                    institutionTypes.Add(new SelectListItem() { Text = idType.Name, Value = idType.Id.ToString() });
                });
            }

            return institutionTypes;
        }
    }
}
