using DiscussipediA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscussipediA.Repos
{
    public class PostsRepo
    {
        private readonly discussipediaContext _context;

        public PostsRepo(discussipediaContext context)
        {
            _context = context;
        }

        public IQueryable<Post> GetAll(int DiscussionId, string sortOrder, string searchString)
        {
            var posts =
                _context.Post.Select(d => d)
                .Where(p => (
                    (p.DiscussionId == DiscussionId)
                    && p.Content.Contains(searchString)
                ));


            switch (sortOrder)
            {
                case "datetime_desc":
                    posts =
                        posts.OrderByDescending(p => p.Datetime);
                    break;
                default:
                    posts =
                        posts.OrderBy(d => d.Datetime);
                    break;
            };
            return posts;
        }
    }
}
