using DiscussipediA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscussipediA.Repos
{
    public class SubjectsRepo
    {
        private readonly discussipediaContext _context;

        public SubjectsRepo(discussipediaContext context)
        {
            _context = context;
        }

        public IQueryable<Subject> GetAll(string sortOrder, string searchString)
        {
            var subjects =
                _context.Subject.Select(s => s)
                .Where(s => s.Name.Contains(searchString));


            switch (sortOrder)
            {
                case "name_desc":
                    subjects =
                        subjects.OrderByDescending(s => s.Name);
                    break;
                default:
                    subjects =
                        subjects.OrderBy(s => s.Name);
                    break;
            };
            return subjects;
        }
    }
}
