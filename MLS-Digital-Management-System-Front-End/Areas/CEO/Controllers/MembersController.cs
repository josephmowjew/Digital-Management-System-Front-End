
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.CEO.Controllers
{
    [Area("CEO")]
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
        }
    }
}
