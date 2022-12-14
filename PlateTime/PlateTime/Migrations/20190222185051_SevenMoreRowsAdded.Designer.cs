// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PlateTimeApp.Models;

namespace PlateTimeApp.Migrations
{
    [DbContext(typeof(NewsFeedContext))]
    [Migration("20190222185051_SevenMoreRowsAdded")]
    partial class SevenMoreRowsAdded
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("PlateTimeApp.Models.NewsFeed", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.ToTable("NewsFeeds");

                    b.HasData(
                        new { Id = 1, Description = "News API has been initialized", Title = "Random Title 1" },
                        new { Id = 2, Description = "User Profile page has been initialized", Title = "Random Title 2" },
                        new { Id = 3, Description = "Random data testing LoremIpsum", Title = "Random Title 3" },
                        new { Id = 4, Description = "<p>magna magna magna elit dolore adipiscing nonummy sed nonummy euismod aliquam elit sed nibh erat consectetuer ut magna dolor consectetuer euismod laoreet ipsum. ipsum sit laoreet dolor nonummy tincidunt ipsum magna tincidunt elit amet sit aliquam ut erat adipiscing consectetuer adipiscing euismod tincidunt diam dolore erat. erat aliquam elit dolor aliquam nonummy dolore tincidunt euismod dolor dolore dolore amet lorem sit lorem ut diam ut consectetuer lorem sit sed. ipsum nibh laoreet nibh dolore erat erat ipsum nibh amet sit laoreet amet dolor nonummy dolor adipiscing dolore tincidunt euismod ipsum dolor aliquam. ut consectetuer dolor adipiscing aliquam amet ut nibh erat laoreet nonummy adipiscing nibh sit erat lorem ut euismod lorem amet nibh ipsum consectetuer. </p>", Title = "<p>erat elit nibh nonummy elit. tincidunt nonummy elit elit sed. </p>" },
                        new { Id = 5, Description = "<p>amet laoreet lorem ipsum magna diam euismod adipiscing consectetuer nibh nonummy euismod amet ipsum ipsum diam elit adipiscing sit aliquam dolor. ipsum elit consectetuer adipiscing aliquam euismod diam erat elit sit sed laoreet consectetuer ut lorem dolor euismod sed dolor sed nibh. lorem tincidunt elit dolor dolor sed ut dolor sed erat consectetuer laoreet magna dolor sed ut ut aliquam dolore sit adipiscing. aliquam sed dolor dolore erat elit lorem adipiscing ut magna lorem nonummy nibh ipsum tincidunt aliquam sit dolore amet ut magna. erat amet dolor lorem elit nibh euismod sed aliquam nonummy adipiscing amet consectetuer ipsum consectetuer consectetuer consectetuer sit ipsum ut laoreet. </p>", Title = "<p>sed lorem lorem euismod. diam laoreet nibh nonummy. </p>" },
                        new { Id = 6, Description = "<p>erat sit erat laoreet tincidunt ut aliquam ipsum dolor ut magna tincidunt ut euismod aliquam diam aliquam lorem dolor lorem diam sed sit nonummy. sed dolor aliquam sed erat euismod dolor laoreet diam ut sed dolore amet sit sed consectetuer ipsum erat sed dolor nibh laoreet amet sit. euismod consectetuer laoreet erat dolore erat magna nibh erat diam adipiscing nibh dolore nonummy dolor nonummy euismod dolor sit lorem amet ipsum amet ut. euismod magna aliquam nonummy erat lorem aliquam euismod aliquam laoreet laoreet tincidunt magna sit aliquam nonummy dolore magna magna laoreet magna magna sed nibh. magna aliquam nonummy diam euismod amet erat nonummy lorem ipsum elit erat lorem elit nibh erat nibh tincidunt tincidunt lorem ut diam euismod sed. </p>", Title = "<p>dolor euismod diam dolore. consectetuer magna laoreet lorem. </p>" },
                        new { Id = 7, Description = "<p>nonummy dolor magna tincidunt lorem diam sit aliquam ipsum amet dolore ipsum ipsum lorem dolor adipiscing elit adipiscing magna erat nibh elit nonummy. sit lorem euismod ut diam magna nibh sit dolor laoreet sed diam sed laoreet adipiscing ipsum erat magna euismod erat euismod magna diam. magna nibh amet diam magna aliquam dolore consectetuer ut dolor euismod tincidunt euismod sed laoreet tincidunt ipsum diam ipsum ut adipiscing euismod nonummy. </p>", Title = "<p>euismod ipsum magna euismod. elit adipiscing sit ipsum. </p>" },
                        new { Id = 8, Description = "<p>tincidunt lorem diam ut consectetuer sit aliquam erat lorem magna ipsum aliquam ipsum laoreet sit erat diam consectetuer euismod dolor sed tincidunt euismod laoreet nibh lorem dolor. ut dolore aliquam erat tincidunt magna elit euismod nibh dolor lorem tincidunt diam nibh lorem dolore dolore adipiscing magna nibh sit dolore sit nibh aliquam laoreet nonummy. amet erat sed ut sit consectetuer ipsum sit sit ipsum magna sed ipsum tincidunt dolor euismod magna sed euismod dolor nonummy sed dolore laoreet sed tincidunt sed. erat aliquam tincidunt elit lorem aliquam adipiscing dolor tincidunt dolor elit magna elit sed elit dolore ut erat aliquam laoreet magna lorem amet consectetuer dolor adipiscing euismod. </p>", Title = "<p>magna aliquam nibh nonummy. nonummy tincidunt ipsum nonummy. </p>" },
                        new { Id = 9, Description = "<p>ipsum lorem lorem euismod sed lorem erat lorem nonummy dolor elit erat euismod dolor magna ut dolor amet elit euismod dolor nibh magna tincidunt sit sed. laoreet erat lorem dolor sed nonummy dolore nonummy amet nonummy aliquam lorem adipiscing aliquam amet dolore lorem euismod diam tincidunt nonummy dolor erat nibh dolor lorem. consectetuer diam sed nonummy sit elit diam lorem consectetuer lorem lorem sed ut dolore dolor ipsum aliquam adipiscing laoreet dolor magna diam elit consectetuer nibh amet. </p>", Title = "<p>dolore magna amet sed tincidunt nonummy. adipiscing consectetuer magna elit diam diam. </p>" },
                        new { Id = 10, Description = "<p>erat sit nibh laoreet diam dolor nonummy tincidunt ipsum magna lorem aliquam nonummy erat dolore ut aliquam magna elit magna magna. magna elit euismod diam adipiscing nibh sed amet sed ipsum lorem nonummy sit laoreet tincidunt tincidunt adipiscing sit erat tincidunt dolore. diam ut amet dolore dolor laoreet euismod ut nibh tincidunt aliquam nonummy amet ipsum laoreet erat consectetuer sit nonummy dolor sed. euismod laoreet lorem elit adipiscing amet dolor ipsum euismod ut sed amet ipsum sed tincidunt sed tincidunt amet dolore laoreet nonummy. </p>", Title = "<p>adipiscing consectetuer nibh elit dolore nibh. ipsum magna lorem erat dolore diam. </p>" }
                    );
                });
#pragma warning restore 612, 618
        }
    }
}
