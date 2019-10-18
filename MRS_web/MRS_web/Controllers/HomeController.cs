using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using MRS_web.Models.EDM;

namespace MRS_web.Controllers
{
    public class HomeController : Controller
    {
        private Models.DataManager _DataManager;

        public HomeController(Models.DataManager DM)
        {
            _DataManager = DM;
        }

        [AcceptVerbs((HttpVerbs.Get))]
        public ActionResult SignIn(bool signOut = false)
        {
            HttpCookie aCookie = Request.Cookies["userInfo"];
            
            if (signOut)
            {
                Session.Remove("UserLogin");
                Session.Remove("UserAdmin");
                Session.Remove("UserFullName");
                
                if (aCookie != null)
                {
                    aCookie.Expires = DateTime.Now.AddDays(-7);
                    Response.Cookies.Add(aCookie);
                }

                return View();
            }

            if (aCookie != null)
                return SignIn(aCookie.Values["UserLogin"], aCookie.Values["UserPass"],"on"); 

            return View();
        }

        [AcceptVerbs((HttpVerbs.Post))]
        public ActionResult SignIn(string Login, string Password, string SaveMe)
        {
            bool Save = SaveMe != null && SaveMe == "on";

            if (string.IsNullOrEmpty(Login))
                ModelState.AddModelError("Login", "Логин не заполнен");

            if (string.IsNullOrEmpty(Password))
                ModelState.AddModelError("Password", "Пароль не заполнен");

            if (!ModelState.IsValid) return View();

            Models.EDM.User user = _DataManager.UserRepo.GetUser(Login);

            if (user == null)
                ModelState.AddModelError("Login", "Пользователь не найден");

            if (!ModelState.IsValid) return View();

            if (user?.Password != Password)
                ModelState.AddModelError("Password", "Пароль введён неверно");

            if (ModelState.IsValid)
            {
                Session["UserLogin"] = Login;
                Session["UserAdmin"] = user.AdminPrivileges.ToString().ToLower();
                Session["UserFullName"] = user.FullName;

                HttpCookie aCookie = Request.Cookies["userInfo"];

                if (aCookie == null && Save)
                {
                    aCookie = new HttpCookie("userInfo");
                    aCookie.Values["UserLogin"] = Login;
                    aCookie.Values["UserPass"] = Password;
                    aCookie.Values["LastVisit"] = DateTime.Now.ToString();
                    aCookie.Expires = DateTime.Now.AddDays(7);
                    Response.Cookies.Add(aCookie);
                }

                if (user.AdminPrivileges)
                    return RedirectToAction("Index", "Admin");

                return RedirectToAction("Index", "User");
            }
            
            return View();
        }

        [HttpGet]
        public ActionResult SignUp()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SignUp(string Login, string Password, string FullName, string PasswordConfirm)
        {
            Login=Login.Trim();
            Password=Password.Trim();
            FullName=FullName.Trim();

            ViewData["Login"] = Login;
            ViewData["Password"] = Password;
            ViewData["FullName"] = FullName;

            if (string.IsNullOrEmpty(Password))
                ModelState.AddModelError("FullName", "Имя не заполнено");

            if (string.IsNullOrEmpty(Login))
                ModelState.AddModelError("Login", "Логин не заполнен");

            if (string.IsNullOrEmpty(Password))
                ModelState.AddModelError("Password", "Пароль не заполнен");

            if (!ModelState.IsValid) return View();


            if (_DataManager.UserRepo.Users().Any(x=>x.Login==Login) ||
                _DataManager.UserRepo.Admins().Any(x => x.Login == Login))
                ModelState.AddModelError("Login", "Данный Логин уже занят кем-то другим");

            if (!ModelState.IsValid) return View();

            if (Password != PasswordConfirm)
                ModelState.AddModelError("PasswordConfirm", "Пароли не совпадают");

            if (!ModelState.IsValid) return View();

            _DataManager.UserRepo.AddUser(Login, Password, FullName);

            User user = _DataManager.UserRepo.GetUser(Login);

            Session["User"] = Login;

            HttpCookie aCookie = new HttpCookie("userInfo");
            aCookie.Values["UserLogin"] = user.Login;
            aCookie.Values["UserPass"] = user.Password;
            aCookie.Values["LastVisit"] = DateTime.Now.ToString();
            aCookie.Expires = DateTime.Now.AddDays(7);
            Response.Cookies.Add(aCookie);
                
            if (user.AdminPrivileges)
                return RedirectToAction("Index", "Admin");

            return RedirectToAction("Index", "User");

            
        }
    }
}