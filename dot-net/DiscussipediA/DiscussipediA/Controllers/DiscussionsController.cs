using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DiscussipediA.Models;
using DiscussipediA.Repos;

namespace DiscussipediA.Models
{
    public class DiscussionsController : Controller
    {
        private readonly discussipediaContext _context;

        public DiscussionsController(discussipediaContext context)
        {
            _context = context;
        }

        // GET: Discussions
        public IActionResult Index(int SubjectId, string sortOrder, string searchString, int? page)
        {
            string sort = String.IsNullOrEmpty(sortOrder) ? "name_asc" : sortOrder;
            string search = String.IsNullOrEmpty(searchString) ? "" : searchString;

            ViewData["CurrentSort"] = sort;
            ViewData["CurrentFilter"] = search;

            var discussions = new DiscussionsRepo(_context).GetAll(SubjectId, sort, search);

            ViewData["SubjectId"] = SubjectId;
            ViewData["SubjectName"] = _context.Subject.Select(s => s).Where(s => s.SubjectId == SubjectId).FirstOrDefault().Name;

            int pageSize = 20;

            return View(PaginatedList<DiscussipediA.Models.Discussion>.Create(discussions, page ?? 1, pageSize));
        }     

        // GET: Discussions/Create
        public IActionResult Create(int SubjectId, string SubjectName)
        {
            ViewData["SubjectId"] = SubjectId;
            ViewData["SubjectName"] = SubjectName;
            return View();
        }

        // POST: Discussions/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DiscussionId,SubjectId,Name")] Discussion discussion)
        {
            if (ModelState.IsValid)
            {
                _context.Add(discussion);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Posts", new { DiscussionId = discussion.DiscussionId });
            }
            ViewData["SubjectId"] = new SelectList(_context.Subject, "SubjectId", "SubjectId", discussion.SubjectId);

            return View(discussion);

        }

        // GET: Discussions/Delete/5
        public async Task<IActionResult> Delete(int SubjectId, int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var discussion = await _context.Discussion
                .FirstOrDefaultAsync(m => m.DiscussionId == id);
            if (discussion == null)
            {
                return NotFound();
            }

            ViewData["SubjectId"] = SubjectId;

            return View(discussion);
        }

        // POST: Discussions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var discussion = await _context.Discussion.FindAsync(id);
            _context.Discussion.Remove(discussion);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new {SubjectId = discussion.SubjectId});
        }

        private bool DiscussionExists(int id)
        {
            return _context.Discussion.Any(e => e.DiscussionId == id);
        }
    }
}
