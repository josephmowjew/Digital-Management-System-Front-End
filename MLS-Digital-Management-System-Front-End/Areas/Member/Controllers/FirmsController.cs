using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Authorize]
    [Area("Member")]
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

        public async Task<IActionResult> FirmDetails(int Id)
        {
            await PopulateViewBags();

            var firmDetails = await _service.FirmService.GetFirmByIdAsync(Id);

            ViewBag.firm = firmDetails;

            return View();
        }

        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
        }
    }
}
