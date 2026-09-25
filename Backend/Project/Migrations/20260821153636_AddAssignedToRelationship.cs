using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignedToRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedTo",
                table: "SPM_Task",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Task_AssignedTo",
                table: "SPM_Task",
                column: "AssignedTo");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Task_SPM_User_AssignedTo",
                table: "SPM_Task",
                column: "AssignedTo",
                principalTable: "SPM_User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Task_SPM_User_AssignedTo",
                table: "SPM_Task");

            migrationBuilder.DropIndex(
                name: "IX_SPM_Task_AssignedTo",
                table: "SPM_Task");

            migrationBuilder.DropColumn(
                name: "AssignedTo",
                table: "SPM_Task");
        }
    }
}
