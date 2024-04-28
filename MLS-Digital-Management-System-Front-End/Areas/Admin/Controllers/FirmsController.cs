using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MLS_Digital_Management_System_Front_End.Areas.Admin.Controllers
{
    [Authorize]
    [Area("Admin")]
    public class FirmsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
