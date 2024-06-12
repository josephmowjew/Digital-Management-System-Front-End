using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class PenaltyPaymentsController : Controller
    {
        private readonly IServiceRepository _service;

        public PenaltyPaymentsController(IServiceRepository serviceRepository)
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
            _service.Token = token;
            ViewBag.YearOfOperation = await GetCurrentYearOfOperationAsync();
            //ViewBag.membersList = await GetAllMembersAsync();
            ViewBag.penaltyList = await GetAllPenaltiesAsync();
            //ViewBag.yearOperationsList = await GetYearOfOperations();
        }

        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await _service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }

        private async Task<List<SelectListItem>> GetAllPenaltiesAsync()
        {
            //return await _service.PenaltyService.GetPenaltyByIdAsync();

            List<SelectListItem> penaltiesList = new() { new SelectListItem() { Text = "---Select Penalty---", Value = "" } };

            //get identity types from remote
            var penaltiesListFromRemote = await _service.PenaltyService.GetAllPenaltiesAsync();

            if (penaltiesListFromRemote != null)
            {
                penaltiesListFromRemote.ForEach(penalty =>
                {
                    penaltiesList.Add(new SelectListItem() { Text = penalty.Reason, Value = penalty.Id.ToString() });
                });
            }

            return penaltiesList;
        }
    }
}
