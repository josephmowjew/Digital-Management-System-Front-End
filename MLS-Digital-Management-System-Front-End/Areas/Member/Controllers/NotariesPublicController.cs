
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class NotariesPublicController : Controller
    {
        private readonly IServiceRepository _service;

        public NotariesPublicController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public async Task<IActionResult> Index()
        {
            await PopulateViewBags();
            return View();
        }

        public async Task<IActionResult> RegisteredNotariesPublic()
        {
            await PopulateViewBagsMinimal();
            return View();
        }

        /*public async Task<IActionResult> LicensedMembers()
        {
            await PopulateViewBags();
            return View();
        }

        public async Task<IActionResult> UnlicensedMembers()
        {
            await PopulateViewBags();
            return View();
        }*/

        private async Task PopulateViewBags()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            _service.Token = token;
            ViewBag.yearOfOperationsList = await GetYearOfOperations();
            ViewBag.membersList = await GetAllMembersAsync();
            ViewBag.memberId = await GetMember();
            ViewBag.notariesPublicByMemberId = await HasUserAppliedForNotariesPublic();
          
        }

        
        private async Task PopulateViewBagsMinimal()
        {
             string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            _service.Token = token;
        }

      
        private async Task<int> GetMember()
        {
            string token = AuthHelper.GetToken(HttpContext);
            string userId = HttpContext.Request.Cookies["UserId"];
            _service.Token = token;

            var member = await _service.MemberService.GetMemberByUserIdAsync(userId);
            return member != null ? member.Id : 0;
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

        private async Task<List<SelectListItem>> GetAllMembersAsync()
        {
            List<SelectListItem> membersList = new() { new SelectListItem() { Text = "---Select Member---", Value = "" } };

            //get identity types from remote
            var memberListFromRemote = await this._service.MemberService.GetAllMembersAsync();

            if (memberListFromRemote != null)
            {
                memberListFromRemote.ForEach(member =>
                {
                    if(member.CustomerId != null){
                        membersList.Add(new SelectListItem() { Text = member.User.FullName + " - " + member.User.IdentityNumber, Value = member.Id.ToString() });
                    }
                });
            }

            return membersList;
        }


        private async Task<bool> HasUserAppliedForNotariesPublic()
        {
            int memberId = await GetMember();

            if(memberId == 0){
                return false;
            }else{
                var notariesPublicApplication = await _service.NotariesPublicService.GetNotaryPublicByMemberIdAsync(memberId);
            return notariesPublicApplication != null;
            }
        }

    }
}
