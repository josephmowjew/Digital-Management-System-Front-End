using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MLS_Digital_Management_System_Front_End.Areas.Executive.Controllers
{
    [Authorize]
    [Area("Executive")]
    public class CountriesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
