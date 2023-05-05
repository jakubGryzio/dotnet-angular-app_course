using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext context;

        public PhotoRepository(DataContext context)
        {
            this.context = context;
        }
        public async Task<Photo> GetPhotoById(int id)
        {
            return await context.Photos
                            .IgnoreQueryFilters()
                            .SingleOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
        {
            return await context.Photos
                            .IgnoreQueryFilters()
                            .Where(p => p.IsApproved == false)
                            .Select(p => new PhotoForApprovalDto
                            {
                                Id = p.Id,
                                Url= p.Url,
                                Username = p.AppUser.UserName,
                                IsApproved= p.IsApproved,
                            }).ToListAsync();
        }

        public void RemovePhoto(Photo photo)
        {
            context.Photos.Remove(photo);
        }
    }
}
