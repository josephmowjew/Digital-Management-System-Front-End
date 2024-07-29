using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
  
    [Area("Member")]
    public class CommitteesController : Controller
    {
        private readonly IServiceRepository _service;
        public CommitteesController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            ViewBag.UserId  = AuthHelper.GetUserId(HttpContext);

            return View();

            
        }

       
        private async Task PopulateViewBags()
        {
            //get the token
            await this.PopulateViewBagsMinimal();
            ViewBag.YearOfOperationList = await GetAllYearOfOperations();

        
        }

        public async Task<IActionResult> CommitteeDetails(int committeeId)
        {
            await PopulateViewBagsMinimal();
            var UserId = AuthHelper.GetUserId(HttpContext);
            ViewBag.userId = UserId;

            ViewBag.CommitteeId = committeeId;
            var member = await _service.MemberService.GetMemberByUserIdAsync(UserId);

            bool isChairperson = await IsUserChairpersonOfCommittee(member.Id, committeeId);
            ViewBag.isChairperson = isChairperson;
            ViewBag.MembersList = await GetAllUsers(committeeId);
            ViewBag.YearOfOperationList = await GetAllYearOfOperations();
            return View();
        }

        public async Task<IActionResult> ViewMemberRequests(int committeeId)
        {
            await PopulateViewBagsMinimal();
            ViewBag.CommitteeId = committeeId;
            ViewBag.MembersList = await GetAllUsers(committeeId);
            return View();
        }
        private async Task<List<SelectListItem>> GetAllYearOfOperations()
        {
            var yearsList = await this._service.YearOfOperationService.GetAllYearOfOperationsAsync();

            List<SelectListItem> yearsOfOperationsList = new List<SelectListItem>();

            if(yearsList != null)
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

        private async Task<List<SelectListItem>> GetAllUsers(int committeeId)
        {
            //var usersList = await this._service.UserService.GetAllUsersAsync();

            var usersList = await this._service.CommitteeMembershipService.GetAllNonMembersAsync(committeeId);

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

        // Method to check if the user is the chairperson of the committee
        private async Task<bool> IsUserChairpersonOfCommittee(int memberId, int committeeId)
        {
            // Implement your logic here to determine if the user is the chairperson
            var committee = await _service.CommitteeService.GetCommitteeByIdAsync(committeeId);
            return committee != null && committee.ChairpersonID == memberId;
        }


    }
}
