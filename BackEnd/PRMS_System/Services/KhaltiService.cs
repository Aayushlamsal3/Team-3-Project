using Newtonsoft.Json;
using System.Text;

namespace PRMS_System.Services
{
    public class KhaltiService
    {
        private readonly HttpClient _httpClient;

        public KhaltiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("Authorization", "key 7f62fff1500b4bfa8648a7fa4f162f74"); // Replace with your actual key
        }

        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
        {
            var url = "https://a.khalti.com/api/v2/epayment/initiate/";

            var payload = new
            {
                return_url = "https://localhost:7040/api/account/khaltiSuccessCallback",
                website_url = "https://localhost:7040/",
                amount = (int)(amount * 100), // Khalti expects amount in paisa
                purchase_order_id = orderId,
                purchase_order_name = orderName,
                customer_info = new
                {
                    name = customerName,
                    email = customerEmail,
                    phone = customerPhone
                }
            };

            var jsonPayload = JsonConvert.SerializeObject(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode(); // Throw if not a success code.

                return await response.Content.ReadAsStringAsync();
        }
    }
}