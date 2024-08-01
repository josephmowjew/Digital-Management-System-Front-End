using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Authorize]
    [Area("Member")]
    public class FirmsController : Controller
    {
        private readonly IServiceRepository _service;
        public FirmsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            var member = await _service.MemberService.GetMemberByUserIdAsync(HttpContext.Request.Cookies["UserId"]);
            ViewBag.member = member != null;
            //ViewBag.membership = member != null;
            ViewBag.membersList = await GetAllMembersAsync();

            return View();

        }

        public async Task<IActionResult> FirmDetails(int Id)
        {
            await PopulateViewBags();

            var firmDetails = await _service.FirmService.GetFirmByIdAsync(Id);

            ViewBag.firm = firmDetails;

            return View();
        }

        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
        }

        private async Task<List<SelectListItem>> GetAllMembersAsync()
        {
            List<SelectListItem> membersList = new() { new SelectListItem() { Text = "--- Select Member ---", Value = "" } };

            //get identity types from remote
            var memberListFromRemote = await this._service.MemberService.GetAllMembersAsync();

            if (memberListFromRemote != null)
            {
                memberListFromRemote.ForEach(member =>
                {
                    if(member.CustomerId != null){
                        membersList.Add(new SelectListItem() { Text = member.User.FullName, Value = member.Id.ToString() });
                    }
                });
            }

            return membersList;
        }
    }
}
