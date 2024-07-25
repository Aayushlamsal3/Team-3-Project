using Microsoft.AspNetCore.Mvc;
using PRMS_System.DTO;
using PRMS_System.Services;

namespace PRMS_System.Controllers
{

        [ApiController]
        [Route("api/[controller]")]
        public class AccountController : ControllerBase
        {
            private readonly AccountService _accountService;
            private readonly KhaltiService _khaltiService;

        public AccountController(AccountService accountService, KhaltiService khaltiService)
            {
                _accountService = accountService;
                _khaltiService = khaltiService;
        }

            [HttpPost("create")]
            public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto createAccountDto)
            {
                var account = await _accountService.CreateAccountAsync(createAccountDto.UserId, createAccountDto.StudentId);
                return Ok(account);
            }

            [HttpPost("transaction")]
            public async Task<IActionResult> RecordTransaction([FromBody] TransactionDto transactionDto)
            {
                var transaction = await _accountService.RecordTransactionAsync(transactionDto.AccountId, transactionDto.Amount, transactionDto.Type, transactionDto.Description);
                return Ok(transaction);
            }

            [HttpGet("details/{userId}")]
            public async Task<IActionResult> GetAccount(int userId)
            {
                var account = await _accountService.GetAccountAsync(userId);
                if (account == null)
                {
                    return NotFound();
                }

                return Ok(account);
            }

        [HttpPost("khalti/initiate-payment")]
        public async Task<IActionResult> InitiatePayment([FromBody] KhaltiPaymentRequestDto paymentRequest)
        {
            var result = await _khaltiService.InitiatePaymentAsync(
                paymentRequest.Amount,
                paymentRequest.OrderId,
                paymentRequest.OrderName,
                paymentRequest.CustomerName,
                paymentRequest.CustomerEmail,
                paymentRequest.CustomerPhone
            );

            return Ok(result);
        }

        [HttpGet("khaltiSuccessCallback")]
        public async Task<IActionResult> KhaltiSuccessCallback([FromQuery] KhaltiCallbackDto callbackDto)
        {
            try
            {
                if (callbackDto.Status == "Completed")
                {
                    // Assuming the purchase_order_id contains the account ID
                    int accountId = int.Parse(callbackDto.PurchaseOrderId);

                    // Process the payment and update the account
                    var transaction = await _accountService.ProcessPaymentAsync(
                        accountId,
                        callbackDto.TotalAmount / 100, // Khalti amount is in paisa
                        callbackDto.Mobile
                    );

                    return Ok(new { message = "Payment processed successfully", transaction });
                }

                return BadRequest(new { message = "Transaction status is not completed" });
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here)
                return StatusCode(500, new { message = "An error occurred while processing the payment callback.", error = ex.Message });
            }
        }
    }
}

