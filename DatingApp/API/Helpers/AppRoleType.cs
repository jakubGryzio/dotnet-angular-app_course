using API.Entities;

namespace API.Helpers
{
    public static class AppRoleType
    {
        public static AppRole Member = new() { Name = AppRoleName.Member };

        public static AppRole Moderator = new() { Name = AppRoleName.Moderator };

        public static AppRole Admin = new() { Name = AppRoleName.Admin };        
    }
}
