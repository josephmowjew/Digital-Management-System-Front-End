using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Executive.Controllers
{
    [Authorize]
    [Area("Executive")]
    public class ProBonoClientsController : Controller
    {
        private readonly IServiceRepository _service;
        public ProBonoClientsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            ViewBag.deleteRequestCount = await GetDeleteRequestCount();
            return View();
        }

        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            
        }

        public async Task<IActionResult> DeleteRequestedClients()
        {
            await PopulateViewBags();

            return View();
        }

        public async Task<int> GetDeleteRequestCount()
        {
            var count = await _service.ProbonoClientService.GetDeleteRequestCount();

            return count;
        }

        



    }
}
