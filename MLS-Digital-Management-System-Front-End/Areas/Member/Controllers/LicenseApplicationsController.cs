using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;
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

            var userId = AuthHelper.GetUserId(HttpContext);
            var member = await _service.MemberService.GetMemberByUserIdAsync(userId);
            ViewBag.membership = member != null;

        }

         public async Task<IActionResult> Details(int id)
        {
            //get the license application record from remote 
             await PopulateViewBags();
            var licenseApplication = await _service.LicenseApplicationService.GetLicenseApplication(id);

            if(licenseApplication == null)
            {
                return NotFound();
            }
            await PopulateViewBags();
            ViewBag.licenseApprovalHistoryList = await GetLicenseApprovalHistory(id);
            ViewBag.licenseApplication = licenseApplication;

            return View(licenseApplication);
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

            //add "other as a last option

            firmsList.Add(new SelectListItem() { Text = "Other", Value = "Other" });

            return firmsList;
        }

        private async Task<bool> HasPreviousLicenseApplication()
        {
            string userId = AuthHelper.GetUserId(HttpContext);

            var hasPreviousLicenseApplication = await this._service.LicenseApplicationService.CheckIfPreviousApplicationExists(userId);
            return hasPreviousLicenseApplication;
        }

        private async Task<List<ReadLicenseApprovalHistoryDTO>> GetLicenseApprovalHistory(int id)
        {
            var licenseApprovalHistory = await this._service.LicenseApprovalHistoryService.GetLicenseApprovalHistoryByIdAsync(id);
            return licenseApprovalHistory;
        }

        public async Task<IActionResult> LicenseCertificate(int id)
        {
            await PopulateViewBags();

            var license = await _service.LicenseService.GetLicense(id);
            ViewBag.license = license;
            return View();
        }
    }
}
