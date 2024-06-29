using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Finance.Controllers
{
    [Area("Finance")]
    public class InvoiceRequestsController : Controller
    {
        private readonly IServiceRepository _service;
        public InvoiceRequestsController(IServiceRepository serviceRepository)
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
            this._service.Token = token;
           
        }

        public async Task<IActionResult> GetInvoiceRequestsOnTrainings(int cpdTrainingId)
        {
            await PopulateViewBags();

            ViewBag.cpdTrainingId = cpdTrainingId;
            return View();
        }


    }
}
