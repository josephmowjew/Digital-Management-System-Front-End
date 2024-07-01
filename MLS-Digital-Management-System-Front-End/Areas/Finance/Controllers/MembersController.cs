using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Finance.Controllers
{
    [Authorize]
    [Area("Finance")]
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


         private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;

            
        }

    }
}
