using System.ComponentModel.DataAnnotations.Schema;

namespace Karpova_back_diplom.Models
{ 
public class Objects
{
    public int id { get; set; }
    public string name { get; set; }

    public int? parent_id { get; set; }

    [ForeignKey("parent_id")]
    public Objects Parent { get; set; }

    public ICollection<Objects> Children { get; set; }
}

}
