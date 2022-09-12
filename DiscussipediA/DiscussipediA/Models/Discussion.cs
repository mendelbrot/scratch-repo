using System;
using System.Collections.Generic;

namespace DiscussipediA.Models
{
    public partial class Discussion
    {
        public Discussion()
        {
            Post = new HashSet<Post>();
        }

        public int DiscussionId { get; set; }
        public int? SubjectId { get; set; }
        public string Name { get; set; }

        public Subject Subject { get; set; }
        public ICollection<Post> Post { get; set; }
    }
}
