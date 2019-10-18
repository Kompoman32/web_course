using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MRS_web.Controllers
{
    public class ControllerFactory: DefaultControllerFactory
    {
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            if (requestContext.HttpContext.Session["UserLogin"] == null &&
                requestContext.HttpContext.Request.Cookies["userInfo"] != null)
            {
                MRS_web.Models.EDM.User user = new MRS_web.Models.DataManager().UserRepo.GetUser(requestContext.HttpContext.Request.Cookies["userInfo"].Values["UserLogin"]);
                requestContext.HttpContext.Session["UserLogin"] = user.Login;
                requestContext.HttpContext.Session["UserAdmin"] = user.AdminPrivileges.ToString().ToLower();
                requestContext.HttpContext.Session["UserFullName"] = user.FullName;
            }
            
            if (controllerType == null)
                return Activator.CreateInstance(typeof(HomeController), new Models.DataManager()) as IController;

            return Activator.CreateInstance(controllerType, new Models.DataManager()) as IController;
        }
    }
}