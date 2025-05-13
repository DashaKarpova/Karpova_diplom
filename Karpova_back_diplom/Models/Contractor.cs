using System.ComponentModel.DataAnnotations.Schema;

namespace Karpova_back_diplom.Models
{
    public class Contractor
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? ownership { get; set; }

        public int? parent_id { get; set; }

        [ForeignKey("parent_id")]
        public Contractor Parent { get; set; }

        public ICollection<Contractor> Children { get; set; }

        [NotMapped]
        public string fullname => $"{ownership} {name}";
    }
}
