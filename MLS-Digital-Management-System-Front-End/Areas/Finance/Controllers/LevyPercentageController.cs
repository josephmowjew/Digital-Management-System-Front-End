using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Finance.Controllers
{
    [Authorize]
    [Area("Finance")]
    public class LevyPercentageController : Controller
    {
        private readonly IServiceRepository _service;

        public LevyPercentageController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public IActionResult Index()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            return View();
        }
    }
}
