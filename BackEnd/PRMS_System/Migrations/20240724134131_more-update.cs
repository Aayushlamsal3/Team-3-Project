using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRMS_System.Migrations
{
    /// <inheritdoc />
    public partial class moreupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parents_Students_StudentId",
                table: "Parents");

            migrationBuilder.DropForeignKey(
                name: "FK_Parents_Students_StudentId1",
                table: "Parents");

            migrationBuilder.DropIndex(
                name: "IX_Parents_StudentId",
                table: "Parents");

            migrationBuilder.DropIndex(
                name: "IX_Parents_StudentId1",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "Parents");

            migrationBuilder.CreateIndex(
                name: "IX_Parents_StudentId",
                table: "Parents",
                column: "StudentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Parents_Students_StudentId",
                table: "Parents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parents_Students_StudentId",
                table: "Parents");

            migrationBuilder.DropIndex(
                name: "IX_Parents_StudentId",
                table: "Parents");

            migrationBuilder.AddColumn<int>(
                name: "StudentId1",
                table: "Parents",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parents_StudentId",
                table: "Parents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Parents_StudentId1",
                table: "Parents",
                column: "StudentId1",
                unique: true,
                filter: "[StudentId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Parents_Students_StudentId",
                table: "Parents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Parents_Students_StudentId1",
                table: "Parents",
                column: "StudentId1",
                principalTable: "Students",
                principalColumn: "StudentId");
        }
    }
}
