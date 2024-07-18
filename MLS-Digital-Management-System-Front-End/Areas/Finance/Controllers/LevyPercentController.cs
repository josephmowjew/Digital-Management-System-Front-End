using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Finance.Controllers
{
    [Authorize]
    [Area("Finance")]
    public class LevyPercentController : Controller
    {
        private readonly IServiceRepository _service;

        public LevyPercentController(IServiceRepository serviceRepository)
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

            ViewBag.levyPercentList = await GetLevyPercents();
            
        }

        private async Task<List<SelectListItem>> GetLevyPercents()
        {
            List<SelectListItem> levyPercentList = new() { new SelectListItem() { Text = "--- Select Levy Percent ---", Value = "" } };

            //get identity types from remote
            var levyPercentsFromRemote =  await this._service.LevyPercentService.GetAllLevyPercentsAsync();

            if (levyPercentsFromRemote != null)
            {
                levyPercentsFromRemote.ForEach(levyPercent =>
                {
                    levyPercentList.Add(new SelectListItem() { Text = levyPercent.PercentageValue + " %", Value = levyPercent.Id.ToString() });
                });
            }

            return levyPercentList;
        }
    }
}
