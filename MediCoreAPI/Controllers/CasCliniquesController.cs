using MediCoreAPI.Data;
using MediCoreAPI.DTOs;
using MediCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MediCoreAPI.Controllers
{
    [ApiController]
    [Route("api/cas-cliniques")]
    public class CasCliniquesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public CasCliniquesController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // GET api/cas-cliniques (public)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.CasCliniques.OrderBy(c => c.CreatedAt).ToListAsync();
            return Ok(list.Select(MapCas));
        }

        // POST api/cas-cliniques (Doctor only)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] CreateCasCliniqueRequest req,
            IFormFile? beforeImg, IFormFile? afterImg)
        {
            var beforeUrl = await SaveFile(beforeImg, "before");
            var afterUrl  = await SaveFile(afterImg, "after");

            var cas = new CasClinique
            {
                Categorie   = req.Categorie,
                Category    = req.Category,
                CatColor    = req.CatColor,
                Titre       = req.Titre,
                Description = req.Description,
                Traitement  = req.Traitement,
                Duree       = req.Duree,
                Tags        = JsonSerializer.Serialize(req.Tags ?? new List<string>()),
                BeforeImg   = beforeUrl ?? "",
                AfterImg    = afterUrl  ?? "",
                SliderPos   = 50,
            };
            _db.CasCliniques.Add(cas);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { }, MapCas(cas));
        }

        // PUT api/cas-cliniques/:id (Doctor only)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] CreateCasCliniqueRequest req,
            IFormFile? beforeImg, IFormFile? afterImg)
        {
            var cas = await _db.CasCliniques.FindAsync(id);
            if (cas == null) return NotFound();

            cas.Categorie   = req.Categorie;
            cas.Category    = req.Category;
            cas.CatColor    = req.CatColor;
            cas.Titre       = req.Titre;
            cas.Description = req.Description;
            cas.Traitement  = req.Traitement;
            cas.Duree       = req.Duree;
            cas.Tags        = JsonSerializer.Serialize(req.Tags ?? new List<string>());

            var beforeUrl = await SaveFile(beforeImg, "before");
            var afterUrl  = await SaveFile(afterImg, "after");
            if (beforeUrl != null) cas.BeforeImg = beforeUrl;
            if (afterUrl  != null) cas.AfterImg  = afterUrl;

            await _db.SaveChangesAsync();
            return Ok(MapCas(cas));
        }

        // PUT api/cas-cliniques/:id/slider
        [HttpPut("{id}/slider")]
        [Authorize]
        public async Task<IActionResult> UpdateSlider(int id, [FromBody] UpdateSliderRequest req)
        {
            var cas = await _db.CasCliniques.FindAsync(id);
            if (cas == null) return NotFound();
            cas.SliderPos = req.SliderPos;
            await _db.SaveChangesAsync();
            return Ok(MapCas(cas));
        }

        // DELETE api/cas-cliniques/:id (Doctor only)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var cas = await _db.CasCliniques.FindAsync(id);
            if (cas == null) return NotFound();
            _db.CasCliniques.Remove(cas);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string?> SaveFile(IFormFile? file, string prefix)
        {
            if (file == null || file.Length == 0) return null;
            var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsDir);
            var fileName = $"{prefix}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);
            using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);
            return $"/uploads/{fileName}";
        }

        private static object MapCas(CasClinique c) => new
        {
            c.Id, c.Categorie, c.Category, c.CatColor, c.Titre,
            c.BeforeImg, c.AfterImg, c.Description, c.Traitement, c.Duree,
            tags = JsonSerializer.Deserialize<List<string>>(c.Tags) ?? new(),
            c.SliderPos, c.CreatedAt
        };
    }
}
