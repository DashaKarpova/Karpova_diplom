using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Karpova_back_diplom.Models
{
    public class Contract
    {
        public int id { get; set; }
        public int number_c { get; set; }
        public string name { get; set; }
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }

        public int contractor_id { get; set; }

        [ForeignKey("contractor_id")]
        public Contractor contractor { get; set; }

        public int object_id { get; set; }

        [ForeignKey("object_id")]
        public Objects objects{ get; set; }

        public string license_number { get; set; }
        public DateTime license_date { get; set; }

        public int authority { get; set; }

        [ForeignKey("authority")]
        public License license { get; set; }

        public DateTime date_of_change { get; set; }

        public int user_id { get; set; }

        [ForeignKey("user_id")]
        public User user { get; set; }

        public bool finished_action { get; set; }
        public ICollection<Services> services { get; set; }

    }
}
