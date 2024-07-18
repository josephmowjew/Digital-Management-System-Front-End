using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MLS_Digital_Management_System_Front_End.Areas.CEO.Controllers
{
    [Authorize]
    [Area("CEO")]
    public class CountriesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
