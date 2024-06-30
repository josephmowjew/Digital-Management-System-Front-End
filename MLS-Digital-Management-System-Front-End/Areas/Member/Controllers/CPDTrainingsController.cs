using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
  
    [Area("Member")]
    public class CPDTrainingsController : Controller
    {
        private readonly IServiceRepository _service;
        public CPDTrainingsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            return View();

            
        }

        public async Task<IActionResult> CPDInvoices()
        {

            await PopulateViewBags();

            return View();


        }

        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.userId = AuthHelper.GetUserId(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.YearOfOperation = await GetCurrentYearOfOperationAsync();
            ViewBag.MemberId = await GetMemberRecordByUserId(HttpContext.Request.Cookies["UserId"]);
        
        }
        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await this._service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }

        private async Task<int> GetMemberRecordByUserId(string id)
        {
            var memberRecord = await this._service.MemberService.GetMemberByUserIdAsync(id);

            if(memberRecord != null)
            {
                return memberRecord.Id;
            }

            return 0;
        }

        public async Task<IActionResult> TrainingDetails(int Id)
        {

            await PopulateViewBags();
            var training = await _service.CpdTrainingService.GetCpdTrainingByIdAsync(Id);

            if (training == null)
            {
                return NotFound();
            }

            ViewBag.training = training;

            return View();
        }

        public async Task<IActionResult> ViewInvoiceRequest(int invoiceRequestId)
        {
            await PopulateViewBags();

            var invoiceRequest = await GetInvoiceRequest(invoiceRequestId);

            return View(invoiceRequest);
        }

        private async Task<ReadInvoiceRequestDTO> GetInvoiceRequest(int id)
        {
            return await _service.InvoiceRequestService.GetInvoiceRequestByIdAsync(id);

        }


    }
}
