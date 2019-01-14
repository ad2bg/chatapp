namespace ChatApp.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class RoomIdNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RoomId",
                table: "Messages",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RoomId",
                table: "Messages",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
