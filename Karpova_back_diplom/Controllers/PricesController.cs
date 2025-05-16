using Karpova_back_diplom.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PricesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prices>>> GetPrices()
        {
            return await _context.prices.ToListAsync();
        }

        [HttpPost("{contractId}")]
        public async Task<ActionResult<Prices>> CreatePrice(int contractId, [FromBody] PriceDto dto)
        {
            var newPrice = new Prices
            {
                price = dto.price,
                valid_from = dto.valid_from.ToUniversalTime(),
                valid_to = dto.valid_to.ToUniversalTime(),
                contract_id = dto.contract_id
            };

            _context.prices.Add(newPrice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrices), new { id = newPrice.id }, newPrice);
        }
    }

    public class PriceDto
    {
        public decimal price { get; set; }
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }
        public int contract_id { get; set; }
    }

}
