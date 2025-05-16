using System.ComponentModel.DataAnnotations.Schema;

namespace Karpova_back_diplom.Models
{
    public class Prices
    {
        public int id { get; set; }
        public decimal price { get; set; }          
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }

        public int contract_id { get; set; }

        [ForeignKey("contract_id")]
        public Contract contract { get; set; }
    }
}
