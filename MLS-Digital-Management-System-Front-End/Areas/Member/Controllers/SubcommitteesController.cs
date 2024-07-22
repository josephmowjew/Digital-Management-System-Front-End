using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class SubcommitteesController : Controller
    {
        private readonly IServiceRepository _service;

        public SubcommitteesController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public async Task<IActionResult> Index()
        {
            await PopulateViewBags();
            ViewBag.UserId = AuthHelper.GetUserId(HttpContext);
            return View();
        }

        private async Task PopulateViewBags()
        {
            await this.PopulateViewBagsMinimal();
            ViewBag.YearOfOperationList = await GetAllYearOfOperations();
        }

        public async Task<IActionResult> ViewMembers(int subcommitteeId)
        {
            await PopulateViewBagsMinimal();
            var UserId = AuthHelper.GetUserId(HttpContext);

            ViewBag.SubcommitteeId = subcommitteeId;
            var member = await _service.MemberService.GetMemberByUserIdAsync(UserId);

            bool isChairperson = await IsUserChairpersonOfSubcommittee(member.Id, subcommitteeId);
            ViewBag.isChairperson = isChairperson;
            ViewBag.MembersList = await GetAllUsers(subcommitteeId);
            return View();
        }

        public async Task<IActionResult> ViewMemberRequests(int subcommitteeId)
        {
            await PopulateViewBagsMinimal();
            ViewBag.SubcommitteeId = subcommitteeId;
            ViewBag.MembersList = await GetAllUsers(subcommitteeId);
            return View();
        }

        private async Task<List<SelectListItem>> GetAllYearOfOperations()
        {
            var yearsList = await this._service.YearOfOperationService.GetAllYearOfOperationsAsync();

            List<SelectListItem> yearsOfOperationsList = new List<SelectListItem>();

            if (yearsList != null)
            {
                yearsList.ForEach(yearOfoperation =>
                {
                    yearsOfOperationsList.Add(new SelectListItem() { Text = yearOfoperation.FormatedDate, Value = yearOfoperation.Id.ToString() });
                });
            }

            return yearsOfOperationsList;
        }

        private async Task<List<ReadMemberDTO>> GetAllMembers()
        {
            var membersList = await this._service.MemberService.GetAllMembersAsync();
            return membersList.ToList();
        }

        private async Task<List<SelectListItem>> GetAllUsers(int subcommitteeId)
        {
            var usersList = await this._service.SubcommitteeMembershipService.GetAllNonMembersAsync(subcommitteeId);

            List<SelectListItem> usersSelectList = new() { new SelectListItem() { Text = "--- Select Member ---", Value = "" } };

            if (usersList != null)
            {
                usersList.ForEach(user =>
                {
                    usersSelectList.Add(new SelectListItem() { Text = user.FullName, Value = user.Id.ToString() });
                });
            }

            return usersSelectList;
        }

        private async Task PopulateViewBagsMinimal()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
        }

        private async Task<bool> IsUserChairpersonOfSubcommittee(int memberId, int subcommitteeId)
        {
            var subcommittee = await _service.SubcommitteeService.GetSubcommitteeByIdAsync(subcommitteeId);
            return subcommittee != null && subcommittee.ChairpersonID == memberId;
        }
    }
}
