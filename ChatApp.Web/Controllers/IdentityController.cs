namespace ChatApp.Web.Controllers
{
    using ChatApp.Data;
    using ChatApp.Data.Models;
    using ChatApp.Web.Models.IdentityViewModels;
    using ChatApp.Web.Infrastructure;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using System.Linq;
    using System.Threading.Tasks;

    [Authorize(Roles = GlobalConstants.AdministratorRole)] // can also be like "Administrator,Moderator,Whatever"
    public class IdentityController : Controller
    {
        private readonly ChatAppDbContext db;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        const string successMessage = GlobalConstants.SuccessMessage;
        const string errorMessage = GlobalConstants.ErrorMessage;

        public IdentityController(
            ChatAppDbContext db,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
            )
        {
            this.db = db;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }


        // ALL

        public IActionResult All()
        {
            var users = this.db
                .Users
                .OrderBy(u => u.Email)
                .Select(u => new ListUserViewModel
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email
                })
                .ToList();

            return View(users);
        }


        // ROLES

        public async Task<IActionResult> Roles(string id)
        {
            var user = await this.userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await this.userManager.GetRolesAsync(user);

            return View(new UserWithRolesViewModel
            {
                Id = user.Id,
                Email = user.Email,
                Roles = roles
            });
        }



        // CREATE

        public IActionResult Create() => View();

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await this.userManager.CreateAsync(new User
            {
                UserName = model.Username,
                Email = model.Email,
            }, model.Password);

            if (result.Succeeded)
            {
                TempData[successMessage] = $"User with email {model.Email} created.";
                return RedirectToAction(nameof(All));
            }
            else
            {
                this.AddModelErrors(result);
                return View(model);
            }
        }


        // CHANGE PASSWORD

        public async Task<IActionResult> ChangePassword(string id)
        {
            var user = await this.userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return View(new IdentityChangePasswordViewModel
            {
                Email = user.Email
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(
            string id,
            IdentityChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await this.userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var token = await this.userManager.GeneratePasswordResetTokenAsync(user);
            var result = await this.userManager.ResetPasswordAsync(user, token, model.Password);

            if (result.Succeeded)
            {
                TempData[successMessage] = $"Password changed for user {user.Email}";
                return RedirectToAction(nameof(All));
            }
            else
            {
                this.AddModelErrors(result);
                return View(model);
            }
        }



        // DELETE

        public async Task<IActionResult> Delete(string id)
        {
            var user = await this.userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return View(new DeleteUserViewModel
            {
                Id = id,
                Email = user.Email
            });
        }

        public async Task<IActionResult> Destroy(string id)
        {
            var user = await this.userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await this.userManager.DeleteAsync(user);


            if (result.Succeeded)
            {
                TempData[successMessage] = $"User {user.Email} deleted.";
                return RedirectToAction(nameof(All));
            }
            else
            {
                TempData[errorMessage] = $"Error deleting user with email {user.Email}!";
                return RedirectToAction(nameof(All));
            }
        }



        // ADD TO ROLE

        public async Task<IActionResult> AddToRole(string id)
        {
            var user = await this.userManager.FindByIdAsync(id);

            var rolesSelectListItems = this.roleManager
                .Roles
                .Select(r => new SelectListItem
                {
                    Text = r.Name,
                    Value = r.Name
                })
                .ToList();


            return View( new AddToRoleViewModel{
                User = user,
                Roles = rolesSelectListItems
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddToRole(string id, string role)
        {
            var user = await this.userManager.FindByIdAsync(id);
            var roleExists = await this.roleManager.RoleExistsAsync(role);
            if (user == null || !roleExists)
            {
                return NotFound();
            }

            var result = await this.userManager.AddToRoleAsync(user, role);
            if (result.Succeeded)
            {
                TempData[successMessage] = $"User {user.Email} added to {role} role.";
                return RedirectToAction(nameof(Roles), new { id = user.Id });
            }
            else
            {
                TempData[errorMessage] = $"Error adding user {user.Email} to {role} role!";
                return RedirectToAction(nameof(Roles), new { id = user.Id });
            }
        }




        private void AddModelErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

    }
}
