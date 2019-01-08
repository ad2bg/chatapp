namespace ChatApp.Web.Controllers
{
    using ChatApp.Data.Models;
    using ChatApp.Services;
    using ChatApp.Web.Infrastructure.Filters;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;

    [Authorize]
    [Log]
    [Route("[controller]/[action]")]
    public class RoomsController : Controller
    {
        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly IRoomService roomService;

        public RoomsController(
            UserManager<User> userManager,
            IUserService userService,
            IRoomService roomService)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.roomService = roomService;
        }



        // INDEX
        public ActionResult Index()
        {
            return View();
        }



        // DETAILS
        public ActionResult Details(int id)
        {
            return View();
        }



        // CREATE
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string roomName)
        {
            try
            {
                var user = await this.userManager.GetUserAsync(User);
                if (user == null)
                {
                    return NotFound();
                }

                this.roomService.Create(roomName, user);

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }



        // EDIT
        public ActionResult Edit(int id)
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }



        // DELETE
        public ActionResult Delete(int id)
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}