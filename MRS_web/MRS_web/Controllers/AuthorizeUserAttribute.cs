using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MRS_web.Models;
using MRS_web.Models.EDM;

namespace MRS_web.Controllers
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {
        // Словарь:  Контроллер - Список доступных actions
        private readonly Dictionary<string, string[]> AdminDictionary;
        private readonly Dictionary<string, string[]> UserDictionary;

        public AuthorizeUserAttribute()
        {
            AdminDictionary=new Dictionary<string, string[]>();
            UserDictionary = new Dictionary<string, string[]>();

            AdminDictionary.Add("Admin", new string[0]);
            AdminDictionary.Add("Database", new string[0]);

            UserDictionary.Add("User", new string[0]);
            UserDictionary.Add("Database",
                new[]
                {
                    "MetersList", "ExportMeterList", "Meter", "ExportMeter", "Parameters", "ExportParameters",
                    "Readings", "ExportReadings", "DocumentList", "ExportDocuments", "UserInfo", "ExportUser"
                });
        }

        //логика проверки на валидность
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            string controller = httpContext.Request.RequestContext.RouteData.Values["controller"].ToString();
            string action = httpContext.Request.RequestContext.RouteData.Values["action"].ToString();

            if (httpContext.Session["UserLogin"] == null) return false;
            
            Dictionary<string, string[]> dict = new DataManager().UserRepo.GetUser(httpContext.Session["UserLogin"].ToString()).AdminPrivileges ? AdminDictionary : UserDictionary;

            return dict.ContainsKey(controller) 
                   && (!dict[controller].Any() || dict[controller].Contains(action));
        }
    }
}