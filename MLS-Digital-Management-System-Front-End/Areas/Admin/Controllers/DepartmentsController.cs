using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Admin.Controllers
{
    [Authorize]
    [Area("Admin")]
    public class DepartmentsController : Controller
    {
         private readonly IServiceRepository _service;
         public DepartmentsController(IServiceRepository service)
         {
             _service = service;
         }
        // GET: DepartmentsController
        public IActionResult Index()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            return View();
        }
    }
}
