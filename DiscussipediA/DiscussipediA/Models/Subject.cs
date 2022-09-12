using System;
using System.Collections.Generic;

namespace DiscussipediA.Models
{
    public partial class Subject
    {
        public Subject()
        {
            Discussion = new HashSet<Discussion>();
        }

        public int SubjectId { get; set; }
        public string Name { get; set; }

        public ICollection<Discussion> Discussion { get; set; }
    }
}
