using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Data;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract([FromBody] CreateContractDto dto)
        {
            var user = await _context.users.FindAsync(dto.user_id);
            if (user == null)
                return NotFound("Пользователь не найден");

            var contractor = await _context.contractors.FindAsync(dto.contractor_id);
            if (contractor == null)
                return NotFound("Контрагент не найден");

            var license = await _context.licensing_authority.FindAsync(dto.authority);
            if (license == null)
                return NotFound("Орган лицензирования не найден");

            var contract = new Contract
            {
                name = dto.name,
                number_c = dto.number_c,
                valid_from = dto.valid_from.ToUniversalTime(),
                valid_to = dto.valid_to.ToUniversalTime(),
                contractor_id = dto.contractor_id,
                license_number = dto.license_number,
                license_date = dto.license_date.ToUniversalTime(),
                authority = dto.authority,
                user_id = dto.user_id,
                date_of_change = DateTime.UtcNow,
                finished_action = false
            };

            _context.contracts.Add(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContractById), new { id = contract.id }, contract);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContractById(int id)
        {
            var contract = await _context.contracts
                .Include(c => c.contractor)
                .Include(c => c.license)
                .Include(c => c.user)
                .FirstOrDefaultAsync(c => c.id == id);

            if (contract == null)
                return NotFound();

            return contract;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetAllContracts()
        {
            var contracts = await _context.contracts
                .Include(c => c.contractor)
                .Include(c => c.license)
                .Include(c => c.user)
                .ToListAsync();

            return Ok(contracts);
        }

    }

    public class CreateContractDto
    {
        public string name { get; set; }
        public int number_c { get; set; }
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }
        public int contractor_id { get; set; }
        public string license_number { get; set; }
        public DateTime license_date { get; set; }
        public int authority { get; set; }
        public int user_id { get; set; }
    }
}
