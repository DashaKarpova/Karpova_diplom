namespace Karpova_back_diplom.Models
{
    public class Prices
    {
        public int id { get; set; }
        public decimal price { get; set; }          
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }
    }
}
