using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Executive.Controllers
{
    [Authorize]
    [Area("Executive")]
    public class ProBonoReportsController : Controller
    {
        private readonly IServiceRepository _service;
        public ProBonoReportsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index(int probonoId=0)
        {

            await PopulateViewBags();

            ViewBag.probonoId =  probonoId;

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
