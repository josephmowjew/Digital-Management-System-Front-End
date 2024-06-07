using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Area("Secretariat")]
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
            this._service.Token = token;
            ViewBag.YearOfOperation = await GetCurrentYearOfOperationAsync();
            ViewBag.membersList = await GetAllMembersAsync();
            ViewBag.penaltyTypeList = await GetAllPenaltiesAsync();
            ViewBag.yearOperationsList = await GetYearOfOperations();
        }

        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await this._service.YearOfOperationService.GetCurrentYearOfOperationAsync();
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
                    membersList.Add(new SelectListItem() { Text = member.User.FullName + " - " + member.User.IdentityNumber, Value = member.Id.ToString() });
                });
            }

            return membersList;
        }

        private async Task<List<SelectListItem>> GetAllPenaltiesAsync()
        {
            List<SelectListItem> penaltyTypesList = new() { new SelectListItem() { Text = "---Select Penalty Types---", Value = "" } };

            //get identity types from remote
            var penaltyTypesListFromRemote = await this._service.PenaltyTypeService.GetAllPenaltyTypesAsync();

            if (penaltyTypesListFromRemote != null)
            {
                penaltyTypesListFromRemote.ForEach(penaltyType =>
                {
                    penaltyTypesList.Add(new SelectListItem() { Text = penaltyType.Name, Value = penaltyType.Id.ToString() });
                });
            }

            return penaltyTypesList;
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
