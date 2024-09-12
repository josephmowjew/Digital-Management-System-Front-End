using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Executive.Controllers
{
    [Authorize]
    [Area("Executive")]
    public class ProBonosController : Controller
    {
        private readonly IServiceRepository _service;
        public ProBonosController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public IActionResult Index()
        {

           PopulateViewBags();

            return View();
        }


        private  void PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;

            
        }

        

       


    }
}
