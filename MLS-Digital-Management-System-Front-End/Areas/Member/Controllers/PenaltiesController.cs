using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
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

        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            _service.Token = token;
            ViewBag.memberId = await GetMemberByUserIdAsync();
            ViewBag.YearOfOperation = await GetCurrentYearOfOperationAsync();
            //ViewBag.membersList = await GetAllMembersAsync();
            ViewBag.penaltyList = await GetAllPenaltiesAsync();
            //ViewBag.penaltyTypeList = await GetAllPenaltyTypesAsync();
            ViewBag.yearOperationsList = await GetYearOfOperations();
        }

        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await _service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }

        private async Task<List<SelectListItem>> GetYearOfOperations()
        {
            List<SelectListItem> yearOperationsList = new() { new SelectListItem() { Text = "---Select Practicing Year---", Value = "" } };

            //get identity types from remote
            var yearsOfOperationFromRemote = await _service.YearOfOperationService.GetAllYearOfOperationsAsync();

            if (yearsOfOperationFromRemote != null)
            {
                yearsOfOperationFromRemote.ForEach(year =>
                {
                    yearOperationsList.Add(new SelectListItem() { Text = year.StartDate.ToString("yyyy") + " - " + year.EndDate.ToString("yyyy"), Value = year.Id.ToString() });
                });
            }

            return yearOperationsList;
        }

        private async Task<List<SelectListItem>> GetAllPenaltiesAsync()
        {
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

        private async Task<int> GetMemberByUserIdAsync()
        {
            string userId = AuthHelper.GetUserId(HttpContext);
            var member = await _service.MemberService.GetMemberByUserIdAsync(userId);
            int memberId = member?.Id ?? 0;

            return memberId;
        }
    }
}
