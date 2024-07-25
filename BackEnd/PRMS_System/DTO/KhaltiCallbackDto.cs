namespace PRMS_System.DTO
{

    public class KhaltiPaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string OrderId { get; set; }
        public string OrderName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
    }

    public class KhaltiCallbackDto
    {
        public string Pidx { get; set; }
        public string TxnId { get; set; }
        public int Amount { get; set; }
        public int TotalAmount { get; set; }
        public string Status { get; set; }
        public string Mobile { get; set; }
        public string Tidx { get; set; }
        public string PurchaseOrderId { get; set; }
        public string PurchaseOrderName { get; set; }
        public string TransactionId { get; set; }
    }

}
