using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
  
    [Area("Secretariat")]
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

            return View();

            
        }

       
        private async Task PopulateViewBags()
        {
            //get the token
            await this.PopulateViewBagsMinimal();
            ViewBag.YearOfOperationList = await GetAllYearOfOperations();
            ViewBag.MembersList = await GetAllMembers();
        
        }

        public async Task<IActionResult> ViewMembers(int committeeId)
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
        private async Task<List<SelectListItem>> GetAllMembers()
        {

            List<SelectListItem> membersSelectList = new() { new SelectListItem() { Text = "--- Select Member ---", Value = "" } };

            var membersList = await this._service.MemberService.GetAllMembersAsync();

            if (membersList != null)
            {
                membersList.ForEach(member =>
                {
                    membersSelectList.Add(new SelectListItem() { Text = $"{member.User.FullName} - {member.User.IdentityNumber}" , Value = member.Id.ToString() });
                });
            }

            return membersSelectList;
        }

        private async Task PopulateViewBagsMinimal()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
        }
       

    }
}
