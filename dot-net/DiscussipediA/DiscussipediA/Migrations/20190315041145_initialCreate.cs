using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DiscussipediA.Migrations
{
    public partial class initialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "subject",
                columns: table => new
                {
                    subject_id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(unicode: false, maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subject", x => x.subject_id);
                });

            migrationBuilder.CreateTable(
                name: "discussion",
                columns: table => new
                {
                    discussion_id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    subject_id = table.Column<int>(nullable: true),
                    name = table.Column<string>(unicode: false, maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_discussion", x => x.discussion_id);
                    table.ForeignKey(
                        name: "FK__discussio__subje__398D8EEE",
                        column: x => x.subject_id,
                        principalTable: "subject",
                        principalColumn: "subject_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "post",
                columns: table => new
                {
                    post_id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    discussion_id = table.Column<int>(nullable: true),
                    username = table.Column<string>(unicode: false, maxLength: 25, nullable: true),
                    datetime = table.Column<DateTime>(type: "datetime", nullable: true),
                    content = table.Column<string>(unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_post", x => x.post_id);
                    table.ForeignKey(
                        name: "FK__post__discussion__3C69FB99",
                        column: x => x.discussion_id,
                        principalTable: "discussion",
                        principalColumn: "discussion_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_discussion_subject_id",
                table: "discussion",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "IX_post_discussion_id",
                table: "post",
                column: "discussion_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "post");

            migrationBuilder.DropTable(
                name: "discussion");

            migrationBuilder.DropTable(
                name: "subject");
        }
    }
}
