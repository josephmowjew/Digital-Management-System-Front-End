
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Authorize]
    [Area("Secretariat")]
    public class StampsController : Controller
    {
        private readonly IServiceRepository _service;

        public StampsController(IServiceRepository serviceRepository)
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
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.yearOperationsList = await GetYearOfOperations();
        }

        private async Task<List<SelectListItem>> GetYearOfOperations()
        {
            List<SelectListItem> yearOperationsList = new() { new SelectListItem() { Text = "---Select Practicing Year---", Value = "" } };

            //get identity types from remote
            var yearsOfOperationFromRemote = await this._service.YearOfOperationService.GetAllYearOfOperationsAsync();

            if (yearsOfOperationFromRemote != null)
            {
                yearsOfOperationFromRemote.ForEach(year =>
                {
                    yearOperationsList.Add(new SelectListItem() { Text = year.StartDate.ToString("yyyy") + " - " + year.EndDate.ToString("yyyy"), Value = year.Id.ToString() });
                });
            }

            return yearOperationsList;
        }
    }
}
