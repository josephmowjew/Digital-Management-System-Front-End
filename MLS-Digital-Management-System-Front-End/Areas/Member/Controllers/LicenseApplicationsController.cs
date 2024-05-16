using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
  
    [Area("Member")]
    public class LicenseApplicationsController : Controller
    {
        private readonly IServiceRepository _service;
        public LicenseApplicationsController(IServiceRepository serviceRepository)
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
             ViewBag.firmsList = await GetFirms();
             ViewBag.hasPreviousLicenseApplication = await HasPreviousLicenseApplication();

           
            
        }
         private async Task<List<SelectListItem>> GetFirms()
        {
            List<SelectListItem> firmsList = new() { new SelectListItem() { Text = "---Select Firm---", Value = "" } };

            //get identity types from remote
            var firmsFromRemote =  await this._service.FirmService.GetAllFirmsAsync();

            if (firmsFromRemote != null)
            {
                firmsFromRemote.ForEach(firm =>
                {
                    firmsList.Add(new SelectListItem() { Text = firm.Name, Value = firm.Id.ToString() });
                });
            }

            return firmsList;
        }
        
        private async Task<bool> HasPreviousLicenseApplication()
        {
            string userId = AuthHelper.GetUserId(HttpContext);

            var hasPreviousLicenseApplication = await this._service.LicenseApplicationService.CheckIfPreviousApplicationExists(userId);
            return hasPreviousLicenseApplication;


        }





       



    }
}
