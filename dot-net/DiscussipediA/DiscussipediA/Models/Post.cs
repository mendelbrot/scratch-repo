using System;
using System.Collections.Generic;

namespace DiscussipediA.Models
{
    public partial class Post
    {
        public int PostId { get; set; }
        public int? DiscussionId { get; set; }
        public string Username { get; set; }
        public DateTime? Datetime { get; set; }
        public string Content { get; set; }

        public Discussion Discussion { get; set; }
    }
}
