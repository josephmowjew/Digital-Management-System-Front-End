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

            ViewBag.penaltyList = await GetAllPenaltiesAsync();

            var UserId = AuthHelper.GetUserId(HttpContext);

            ViewBag.member = await _service.MemberService.GetMemberByUserIdAsync(UserId);
        }

        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await _service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }

        private async Task<List<SelectListItem>> GetAllPenaltiesAsync()
        {
            var UserId = AuthHelper.GetUserId(HttpContext);

            var member = await _service.MemberService.GetMemberByUserIdAsync(UserId);

            List<SelectListItem> penaltiesList = new() { new SelectListItem() { Text = "---Select Penalty---", Value = "" } };

            //get identity types from remote
            var penaltiesListFromRemote = await _service.PenaltyService.GetAllPenaltiesAsync();

            // Filter the penalties that match the member's memberId
            if(member != null)
            {
                var memberPenalties = penaltiesListFromRemote.Where(p => p.MemberId == member.Id).ToList();

                if (memberPenalties != null)
                {
                    memberPenalties.ForEach(penalty =>
                    {
                        if (penalty.AmountRemaining != 0)
                            penaltiesList.Add(new SelectListItem() { Text = penalty.Reason, Value = penalty.Id.ToString() });

                    });
                }
            }

            return penaltiesList;
        }
    }
}
