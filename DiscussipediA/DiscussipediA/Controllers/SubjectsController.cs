﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DiscussipediA.Models;
using DiscussipediA.Repos;

namespace DiscussipediA.Controllers
{
    public class SubjectsController : Controller
    {
        private readonly discussipediaContext _context;

        public SubjectsController(discussipediaContext context)
        {
            _context = context;
        }

        // GET: Subjects
        public IActionResult Index(string sortOrder, string searchString, int? page)
        {
            string sort = String.IsNullOrEmpty(sortOrder) ? "name_asc" : sortOrder;
            string search = String.IsNullOrEmpty(searchString) ? "" : searchString;

            ViewData["CurrentSort"] = sort;
            ViewData["CurrentFilter"] = search;

            var subjects = new SubjectsRepo(_context).GetAll(sort, search);

            int pageSize = 20;

            return View(PaginatedList<DiscussipediA.Models.Subject>.Create(subjects, page ?? 1, pageSize));
        }

        // GET: Subjects/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Subjects/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("SubjectId,Name")] Subject subject)
        {
            if (ModelState.IsValid)
            {
                _context.Add(subject);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(subject);
        }

        // GET: Subjects/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var subject = await _context.Subject
                .FirstOrDefaultAsync(m => m.SubjectId == id);
            if (subject == null)
            {
                return NotFound();
            }

            return View(subject);
        }

        // POST: Subjects/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var subject = await _context.Subject.FindAsync(id);
            _context.Subject.Remove(subject);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool SubjectExists(int id)
        {
            return _context.Subject.Any(e => e.SubjectId == id);
        }
    }
}
