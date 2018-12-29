namespace ChatApp.Data
{
    using ChatApp.Data.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    public class ChatAppDbContext : IdentityDbContext<User>
    {
        public ChatAppDbContext(DbContextOptions<ChatAppDbContext> options)
            : base(options)
        {
        }


        public DbSet<Message> Messages { get; set; }

        public DbSet<Room> Rooms { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            // Message >- Sender
            builder
                .Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);


            // Message >- Recipient
            builder
                .Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Message >- Room
            builder
                .Entity<Message>()
                .HasOne(m => m.Room)
                .WithMany(r => r.ReceivedMessages)
                .HasForeignKey(m => m.RoomId)
                .OnDelete(DeleteBehavior.Restrict);


            // Room >- Owner
            builder
                .Entity<Room>()
                .HasOne(r => r.Owner)
                .WithMany(u => u.RoomsOwned)
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);


            // Room >-< Member
            builder
                .Entity<RoomMember>()
                .HasKey(rm => new { rm.RoomId, rm.MemberId });
            builder
                .Entity<RoomMember>()
                .HasOne(rm => rm.Room)
                .WithMany(r => r.Members)
                .HasForeignKey(rm => rm.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
            builder
                .Entity<RoomMember>()
                .HasOne(rm => rm.Member)
                .WithMany(u => u.RoomsMemberOf)
                .HasForeignKey(p => p.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
