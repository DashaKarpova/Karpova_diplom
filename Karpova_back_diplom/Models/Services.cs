using System.ComponentModel.DataAnnotations.Schema;

namespace Karpova_back_diplom.Models
{
    public class Services
    {
        public int id { get; set; }
   
        public int operation_id { get; set; }

        [ForeignKey("operation_id")]
        public Operation operation { get; set; }

        public int resource_id { get; set; }

        [ForeignKey("resource_id")]
        public Resource resource { get; set; }

        public int article_id { get; set; }

        [ForeignKey("article_id")]
        public Article article { get; set; }

        public string unit_of_measurement { get; set; }

        public string name { get; set; }

        public string aim { get; set; }

        public int contract_id { get; set; }

        [ForeignKey("contract_id")]
        public Contract contract { get; set; }

        public DateTime date_of_change { get; set; }

        public int user_id { get; set; }

        [ForeignKey("user_id")]
        public User user { get; set; }

    }
}
