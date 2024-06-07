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
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.YearOfOperationList = await GetAllYearOfOperations();
            ViewBag.MembersList = await GetAllMembers();
        
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

        private async Task<List<SelectListItem>> GetAllMembers()
        {
            var membersList = await this._service.MemberService.GetAllMembersAsync();

            List<SelectListItem> membersSelectList = new List<SelectListItem>();

            if(membersList != null)
            {
                membersList.ForEach(member =>
                {
                    membersSelectList.Add(new SelectListItem() { Text = $"{member.User.FullName} - {member.User.IdentityNumber}" , Value = member.Id.ToString() });
                });
            }

            return membersSelectList;
        }
       

    }
}
