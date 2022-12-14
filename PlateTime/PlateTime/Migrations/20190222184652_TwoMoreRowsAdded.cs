using Microsoft.EntityFrameworkCore.Migrations;

namespace PlateTimeApp.Migrations
{
    public partial class TwoMoreRowsAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NewsFeeds",
                keyColumn: "Id",
                keyValue: 2,
                column: "Title",
                value: "Random Title 2");

            migrationBuilder.InsertData(
                table: "NewsFeeds",
                columns: new[] { "Id", "Description", "Title" },
                values: new object[] { 3, "Random data testing LoremIpsum", "Random Title 3" });

            migrationBuilder.InsertData(
                table: "NewsFeeds",
                columns: new[] { "Id", "Description", "Title" },
                values: new object[] { 4, "<p>aliquam sed adipiscing euismod nonummy erat ut dolore magna erat nibh amet lorem lorem adipiscing tincidunt nonummy sed magna diam ipsum consectetuer tincidunt sed erat amet sed sed nonummy magna lorem diam elit nonummy laoreet erat consectetuer dolore aliquam nibh erat aliquam lorem nibh magna nibh elit dolor diam dolor nonummy diam sit. euismod ipsum tincidunt ut aliquam euismod consectetuer nibh adipiscing adipiscing lorem aliquam ipsum magna nonummy amet adipiscing sed tincidunt diam adipiscing diam sit consectetuer dolor nonummy sed magna adipiscing aliquam sed adipiscing nibh adipiscing ut sed dolor consectetuer elit amet euismod lorem tincidunt nibh erat euismod dolore ut magna magna dolor tincidunt dolore. erat magna sit magna elit euismod elit sit sed consectetuer elit aliquam tincidunt elit laoreet dolor ipsum dolor ipsum lorem diam magna consectetuer dolore nibh consectetuer diam ut tincidunt erat sed dolore ut nonummy nibh diam nibh nonummy ut euismod erat lorem amet laoreet adipiscing tincidunt adipiscing consectetuer ipsum euismod dolore ut lorem. euismod elit dolor nibh elit adipiscing dolor dolor tincidunt nonummy sed dolore nonummy sit sit laoreet adipiscing nonummy nonummy sed sed ipsum diam tincidunt nonummy diam magna erat amet tincidunt ipsum sit ut laoreet ipsum sit diam magna amet amet euismod nonummy adipiscing nonummy laoreet aliquam laoreet nonummy dolor diam ut ipsum consectetuer. adipiscing euismod nibh magna diam lorem magna sed dolor magna lorem sed consectetuer dolor laoreet dolor lorem consectetuer sed adipiscing consectetuer dolore aliquam laoreet erat aliquam nibh ut elit dolore ut aliquam erat magna elit sit diam consectetuer lorem magna adipiscing dolore diam euismod adipiscing ipsum diam dolore lorem elit dolor sit adipiscing. laoreet lorem diam ut dolore aliquam nibh sed sit lorem consectetuer dolor ipsum diam elit ut nibh euismod laoreet consectetuer nonummy erat diam adipiscing consectetuer sed magna sed laoreet ut erat ut nibh nibh sit magna aliquam diam tincidunt adipiscing diam sed sit laoreet sit nonummy amet nibh ipsum ipsum sed laoreet elit. aliquam dolore dolore nonummy sit sed elit lorem dolor euismod sed lorem nibh nibh nonummy consectetuer nonummy dolore dolor erat diam dolore ipsum laoreet tincidunt dolor ut amet adipiscing adipiscing tincidunt consectetuer amet elit tincidunt laoreet elit adipiscing laoreet lorem consectetuer consectetuer adipiscing laoreet ut laoreet euismod aliquam tincidunt adipiscing nibh consectetuer consectetuer. </p>", "<p>magna diam sit dolor euismod ipsum aliquam ipsum sed. sed aliquam nonummy laoreet aliquam nonummy nonummy dolor consectetuer. </p>" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NewsFeeds",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "NewsFeeds",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "NewsFeeds",
                keyColumn: "Id",
                keyValue: 2,
                column: "Title",
                value: "Random Title 1");
        }
    }
}
