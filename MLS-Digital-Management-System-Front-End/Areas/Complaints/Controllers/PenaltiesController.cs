using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Complaints.Controllers
{
    [Area("Complaints")]
    public class PenaltiesController : Controller
    {
        private readonly IServiceRepository _service;
        public PenaltiesController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            return View();
        }

        // public async Task<IActionResult> Details(int id)
        // {
        //     //get the penalty record from remote 
        //     await PopulateViewBags();
        //     var penalty = await _service.PenaltyService.GetPenalty(id);

        //     if (penalty == null)
        //     {
        //         return NotFound();
        //     }
        //     await PopulateViewBags();

        //     ViewBag.penalty = penalty;
        //     ViewBag.penaltyHistoryList = await GetPenaltyHistory(id);

        //     return View(penalty);
        // }


        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;


        }




    }
}
