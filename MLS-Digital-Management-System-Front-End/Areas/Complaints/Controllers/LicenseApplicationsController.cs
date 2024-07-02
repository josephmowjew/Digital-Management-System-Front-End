using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Complaints.Controllers
{
  
    [Area("Complaints")]
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

            ViewBag.licenseApplication = licenseApplication;
            ViewBag.licenseApprovalHistoryList = await GetLicenseApprovalHistory(id);

            return View(licenseApplication);
        }


        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            
            
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

    }
}
