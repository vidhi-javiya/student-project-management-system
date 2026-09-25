using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingAndFileUrlToTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Task_SPM_Priority_PriorityID",
                table: "SPM_Task");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Task_SPM_Project_ProjectId",
                table: "SPM_Task");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Task_SPM_Status_TaskStatus",
                table: "SPM_Task");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Task_SPM_User_AssignedTo",
                table: "SPM_Task");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SPM_Task",
                table: "SPM_Task");

            migrationBuilder.RenameTable(
                name: "SPM_Task",
                newName: "SPM_Tasks");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Task_TaskStatus",
                table: "SPM_Tasks",
                newName: "IX_SPM_Tasks_TaskStatus");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Task_ProjectId",
                table: "SPM_Tasks",
                newName: "IX_SPM_Tasks_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Task_PriorityID",
                table: "SPM_Tasks",
                newName: "IX_SPM_Tasks_PriorityID");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Task_AssignedTo",
                table: "SPM_Tasks",
                newName: "IX_SPM_Tasks_AssignedTo");

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "SPM_Tasks",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "SPM_Tasks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SPM_Tasks",
                table: "SPM_Tasks",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Tasks_SPM_Priority_PriorityID",
                table: "SPM_Tasks",
                column: "PriorityID",
                principalTable: "SPM_Priority",
                principalColumn: "PriorityID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Tasks_SPM_Project_ProjectId",
                table: "SPM_Tasks",
                column: "ProjectId",
                principalTable: "SPM_Project",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Tasks_SPM_Status_TaskStatus",
                table: "SPM_Tasks",
                column: "TaskStatus",
                principalTable: "SPM_Status",
                principalColumn: "StatusID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Tasks_SPM_User_AssignedTo",
                table: "SPM_Tasks",
                column: "AssignedTo",
                principalTable: "SPM_User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Tasks_SPM_Priority_PriorityID",
                table: "SPM_Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Tasks_SPM_Project_ProjectId",
                table: "SPM_Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Tasks_SPM_Status_TaskStatus",
                table: "SPM_Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Tasks_SPM_User_AssignedTo",
                table: "SPM_Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SPM_Tasks",
                table: "SPM_Tasks");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "SPM_Tasks");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "SPM_Tasks");

            migrationBuilder.RenameTable(
                name: "SPM_Tasks",
                newName: "SPM_Task");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Tasks_TaskStatus",
                table: "SPM_Task",
                newName: "IX_SPM_Task_TaskStatus");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Tasks_ProjectId",
                table: "SPM_Task",
                newName: "IX_SPM_Task_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Tasks_PriorityID",
                table: "SPM_Task",
                newName: "IX_SPM_Task_PriorityID");

            migrationBuilder.RenameIndex(
                name: "IX_SPM_Tasks_AssignedTo",
                table: "SPM_Task",
                newName: "IX_SPM_Task_AssignedTo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SPM_Task",
                table: "SPM_Task",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Task_SPM_Priority_PriorityID",
                table: "SPM_Task",
                column: "PriorityID",
                principalTable: "SPM_Priority",
                principalColumn: "PriorityID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Task_SPM_Project_ProjectId",
                table: "SPM_Task",
                column: "ProjectId",
                principalTable: "SPM_Project",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Task_SPM_Status_TaskStatus",
                table: "SPM_Task",
                column: "TaskStatus",
                principalTable: "SPM_Status",
                principalColumn: "StatusID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Task_SPM_User_AssignedTo",
                table: "SPM_Task",
                column: "AssignedTo",
                principalTable: "SPM_User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
