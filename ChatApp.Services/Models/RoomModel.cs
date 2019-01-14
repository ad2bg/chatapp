namespace ChatApp.Services.Models
{
    using ChatApp.Data.Models;
    using ChatApp.Services.Infrastructure.Mapping;

    public class RoomModel: IMapFrom<Room>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string OwnerId { get; set; }

        public int MembersCount { get; set; }

        public bool IsMember { get; set; }

        public void ConfigureMapping(AutoMapperProfile profile)
            => profile.CreateMap<Room, RoomModel>();
    }
}
