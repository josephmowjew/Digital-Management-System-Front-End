using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {   
    
            return View();
        }

       
    
    }
}
