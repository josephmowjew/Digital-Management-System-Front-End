using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Area("Secretariat")]
    public class GenericSignaturesController : Controller
    {
        private readonly IServiceRepository _service;
        
        public GenericSignaturesController(IServiceRepository serviceRepository)
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
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            _service.Token = token;
        }
    }
} 