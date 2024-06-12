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

        public async Task<IActionResult> ViewMembers(int committeeId)
        {
            await PopulateViewBagsMinimal();
            ViewBag.CommitteeId = committeeId;
           
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

        private async Task PopulateViewBagsMinimal()
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
        }
       

    }
}
