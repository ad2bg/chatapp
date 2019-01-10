namespace ChatApp.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class RoomOwnerNotRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "OwnerId",
                table: "Rooms",
                nullable: true,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "OwnerId",
                table: "Rooms",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
