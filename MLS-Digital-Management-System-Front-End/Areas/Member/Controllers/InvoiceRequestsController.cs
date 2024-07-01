using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class InvoiceRequestsController : Controller
    {
        private readonly IServiceRepository _service;
        public InvoiceRequestsController(IServiceRepository serviceRepository)
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
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
           
        }

        public async Task<IActionResult> GetInvoiceRequestsOnTrainings(int cpdTrainingId)
        {
            await PopulateViewBags();

            ViewBag.cpdTrainingId = cpdTrainingId;
            ViewBag.cpdTraining = await GetInvoiceRequestsOnTraining(cpdTrainingId);
            return View();
        }

        public async Task<IActionResult> GetPaidInvoiceRequestsOnTrainings(int cpdTrainingId)
        {
            await PopulateViewBags();

            ViewBag.cpdTrainingId = cpdTrainingId;
            ViewBag.cpdTraining = await GetInvoiceRequestsOnTraining(cpdTrainingId);
            return View();
        }

        private async Task<ReadCPDTrainingDTO> GetInvoiceRequestsOnTraining(int cpdTrainingId)
        {
            return await _service.CpdTrainingService.GetCpdTrainingByIdAsync(cpdTrainingId);

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
