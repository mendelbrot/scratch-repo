using DiscussipediA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscussipediA.Repos
{
    public class DiscussionsRepo
    {
        private readonly discussipediaContext _context;

        public DiscussionsRepo(discussipediaContext context)
        {
            _context = context;
        }

        public IQueryable<Discussion> GetAll(int SubjectId, string sortOrder, string searchString)
        {
            var discussions =
                _context.Discussion.Select(d => d)
                .Where(d => (
                    (d.SubjectId == SubjectId)
                    && d.Name.Contains(searchString)
                ));


            switch (sortOrder)
            {
                case "name_desc":
                    discussions =
                        discussions.OrderByDescending(d => d.Name);
                    break;
                default:
                    discussions =
                        discussions.OrderBy(d => d.Name);
                    break;
            };
            return discussions;
        }
    }
}
