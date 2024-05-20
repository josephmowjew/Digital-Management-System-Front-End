using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;


namespace MLS_Digital_Management_System_Front_End.Areas.Finance.Controllers
{
    [Area("Finance")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IServiceRepository _service;
        public HomeController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public IActionResult Index()
        {   
    
            return View();
        }

        public async Task<IActionResult> Profile()
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
            ViewBag.userId = HttpContext.Request.Cookies["UserId"];
            ViewBag.roleName = HttpContext.Request.Cookies["RoleName"];
        }


        



       
    
    }
}
