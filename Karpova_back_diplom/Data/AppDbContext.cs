using Karpova_back_diplom.Models;
using Microsoft.EntityFrameworkCore;

namespace Karpova_back_diplom.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Contractor> contractors { get; set; }
        public DbSet<Objects> objects { get; set; }
        public DbSet<License> licensing_authority { get; set; }
        public DbSet<Prices> prices { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Contract> contracts { get; set; }

        public DbSet<Services> services { get; set; }
        public DbSet<Operation> operations { get; set; }
        public DbSet<Resource> resources { get; set; }
        public DbSet<Article> articles { get; set; }
    }
}
