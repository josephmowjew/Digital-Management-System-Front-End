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
    public class LicenseController : Controller
    {
        private readonly IServiceRepository _service;
        public LicenseController(IServiceRepository serviceRepository)
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

            var userId = AuthHelper.GetUserId(HttpContext);
            var member = await _service.MemberService.GetMemberByUserIdAsync(userId);
            ViewBag.membership = member != null;
            ViewBag.member = member;
        }

        public async Task<IActionResult> LicenseCertificate(int id)
        {
            await PopulateViewBags();

            var license = await _service.LicenseService.GetLicense(id);
            ViewBag.license = license;
            return View();
        }

        public async Task<IActionResult> Verify(int id)
        {
            await PopulateViewBags();

            var license = await _service.LicenseService.GetLicense(id);
            ViewBag.license = license;
            return View();
        }
    }
}
