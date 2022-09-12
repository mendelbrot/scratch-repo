using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DiscussipediA.Models;
using DiscussipediA.Repos;
using DiscussipediA.Services;
using Microsoft.AspNetCore.Http;

namespace DiscussipediA.Controllers
{
    public class PostsController : Controller
    {
        private readonly discussipediaContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PostsController(IHttpContextAccessor httpContextAccessor, discussipediaContext context)
        {
            _context = context;
            this._httpContextAccessor = httpContextAccessor;
        }

        // GET: Posts
        public IActionResult Index(int DiscussionId, string sortOrder, string searchString, int? page)
        {
            string sort = String.IsNullOrEmpty(sortOrder) ? "datetime_asc" : sortOrder;
            string search = String.IsNullOrEmpty(searchString) ? "" : searchString;

            ViewData["CurrentSort"] = sort;
            ViewData["CurrentFilter"] = search;

            var posts = new PostsRepo(_context).GetAll(DiscussionId, sort, search);

            ViewData["DiscussionId"] = DiscussionId;
            ViewData["DiscussionName"] = _context.Discussion.Select(d => d).Where(d => d.DiscussionId == DiscussionId).FirstOrDefault().Name;

            int pageSize = 20;

            return View(PaginatedList<DiscussipediA.Models.Post>.Create(posts, page ?? 1, pageSize));
        }

        // GET: Posts/Create
        public IActionResult Create(int DiscussionId, string DiscussionName)
        {
            CookieHelper cookieHelper = new CookieHelper(_httpContextAccessor, Request, Response);

            string aliasName = cookieHelper.Get("aliasName");
            ViewData["aliasName"] = aliasName;

            ViewData["DiscussionId"] = DiscussionId;
            ViewData["DiscussionName"] = DiscussionName;

            return View();
        }

        // POST: Posts/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PostId,DiscussionId,Username,Datetime,Content")] Post post)
        {
            CookieHelper cookieHelper = new CookieHelper(_httpContextAccessor, Request, Response);

            if (ModelState.IsValid)
            {
                _context.Add(post);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index), new {DiscussionID = post.DiscussionId});
            }
            ViewData["DiscussionId"] = new SelectList(_context.Discussion, "DiscussionId", "DiscussionId", post.DiscussionId);

            cookieHelper.Set("aliasName", post.Username, 1000);

            return View(post);
        }

        // GET: Posts/Delete/5
        public async Task<IActionResult> Delete(int DiscussionId, int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.Post
                .Include(p => p.Discussion)
                .FirstOrDefaultAsync(m => m.PostId == id);
            if (post == null)
            {
                return NotFound();
            }

            ViewData["DiscussionId"] = DiscussionId;

            return View(post);
        }

        // POST: Posts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.Post.FindAsync(id);
            _context.Post.Remove(post);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new { DiscussionId = post.DiscussionId });
        }

        private bool PostExists(int id)
        {
            return _context.Post.Any(e => e.PostId == id);
        }
    }
}
