using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IPhotoService photoService;

        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork, IPhotoService photoService)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.photoService = photoService;
        }

        [Authorize(Policy = AppPolicyName.RequireAdminRole)]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = AppPolicyName.RequireAdminRole)]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

            var selectedRoles = roles.Split(",").ToArray();

            var user =await userManager.FindByNameAsync(username);

            if (user == null) return NotFound();

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed tro remove from roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = AppPolicyName.ModeratePhotoRole)]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await unitOfWork.PhotoRepository.GetUnapprovedPhotos();
            if (photos != null)
            {
                return Ok(photos);
            }

            return Ok("There are no photos to approve");
        }

        [Authorize(Policy = AppPolicyName.ModeratePhotoRole)]
        [HttpPost("approve-photo/{id}")]
        public async Task<ActionResult> ApprovePhoto(int id)
        {
            var photo = await unitOfWork.PhotoRepository.GetPhotoById(id);
            if (photo == null) return NotFound();
            photo.IsApproved = true;

            var user = await unitOfWork.UserRepository.GetUserByPhotoId(id);
            if (!user.Photos.Any(p => p.IsMain))
                photo.IsMain = true;

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Problem approving photo");
        }

        [Authorize(Policy = AppPolicyName.ModeratePhotoRole)]
        [HttpPost("reject-photo/{id}")]
        public async Task<ActionResult> RejectPhoto(int id)
        {
            var photo = await unitOfWork.PhotoRepository.GetPhotoById(id);
            if (photo == null) return NotFound();
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Result == "ok")
                {
                    unitOfWork.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                unitOfWork.PhotoRepository.RemovePhoto(photo);
            }

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Problem rejecting photo");
        }
    }
}
