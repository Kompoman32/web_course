using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;
using MainLib;
using Microsoft.Ajax.Utilities;
using MRS_web.Models;
using MRS_web.Models.EDM;

namespace MRS_web.Controllers
{
    [AuthorizeUser]
    public class DatabaseController : Controller
    {
        readonly DataManager _DataManager;

        public DatabaseController(DataManager dm)
        {
            _DataManager = dm;
        }
        private void ExportResponce(string fileName)
        {
            Response.ContentType = "application/octet-stream";
            Response.AppendHeader("Content-Disposition", $"attachment; filename={fileName}");
            Response.TransmitFile(Server.MapPath($"~/Output_Excel/{fileName}"));
            Response.End();

            FileInfo fi = new FileInfo(Server.MapPath($"~/Output_Excel/{fileName}"));
            fi.Delete();
        }

        public ActionResult Constructor()
        {
            return View();
        }

        public ActionResult ConstructorGetData(string request)
        {
            string req=Server.UrlDecode(request);
            //req = "&start=(&start=(&Entity=Счётчик&Collection=Показания&Sign=Количество <&input=5&Or=ИЛИ&Entity=Счётчик&Entity=Пользователь&Bool=Администратор?&Sign===&input=False";

            IEnumerable<IConstructor> collection=null;
            System.Type type= typeof(object);
            string msg = "";
            try
            {
                collection = new RequestConstructor(_DataManager).GiveCollection( req, out type).ToList();
            }
            catch (NullReferenceException e)
            {
                msg = "Ничего не найдено";
            }
            catch (ArgumentNullException e)
            {
                msg = "Ничего не найдено";
            }
            catch (Exception e)
            {
                msg = "Ошибка в запросе, проверьте все типы введённых данных";
                Debug.Write(e);
            }

            if (msg != "") return PartialView("Error",msg);

            if (collection == null || !collection.Any())
                return PartialView("Error", "Ничего не найдено");

            if (type == typeof(Meter))
            {
                ViewData["Meters"] = collection?.Cast<Meter>();
                return PartialView("MetersList");
            }

            if (type == typeof(InstalledMeter))
            {
                ViewData["Meters"] = collection?.Cast<InstalledMeter>();
                return PartialView("MetersList");
            }

            if (type == typeof(User))
            {
                ViewData["Users"] = collection?.Cast<User>();
                return PartialView("UserList");
            }

            if (type == typeof(Tariff))
            {
                ViewData["Tariffes"] = collection?.Cast<Tariff>();
                return PartialView("TariffList");
            }

            if (type == typeof(MRS_web.Models.EDM.TimeSpan))
            {
                ViewData["TimeSpans"] = collection?.Cast<MRS_web.Models.EDM.TimeSpan>();
                return PartialView("TimeSpans");
            }

            if (type == typeof(MRS_web.Models.EDM.Type))
            {
                ViewData["Types"] = collection?.Cast<MRS_web.Models.EDM.Type>();
                return PartialView("TypeList");
            }

            if (type == typeof(Parametr))
            {
                ViewData["Parameters"] = collection?.Cast<Parametr>();
                return PartialView("ParameterList");
            }

            if (type == typeof(Reading))
            {
                ViewData["Readings"] = collection?.Cast<Reading>();
                return PartialView("Readings");
            }

            if (type == typeof(Document))
            {
                ViewData["Documents"] = collection?.Cast<Document>();
                return PartialView("DocumentList");
            }

            return PartialView("Error","очень непонятно, предоставьте программисту скриншот данных при которых это произошло");
        }

        public void ConstructorToExcel(string request)
        {
            string req = Server.UrlDecode(request);
            //req = "&start=(&start=(&Entity=Счётчик&Collection=Показания&Sign=Количество <&input=5&Or=ИЛИ&Entity=Счётчик&Entity=Пользователь&Bool=Администратор?&Sign===&input=False";

            IEnumerable<IConstructor> collection = null;
            System.Type type = typeof(object);
            string msg = "";
            try
            {
                collection = new RequestConstructor(_DataManager).GiveCollection(req, out type);
            }
            catch (Exception e)
            {
                Debug.Write(e);
                return;
            }

            if (msg != "") return;

            string filename = "search.xlsx";

            DataManager.ExportToExcel(filename, new []{DataManager.GetDataTable(collection)});
            ExportResponce(filename);
        }

        public ActionResult MetersList(string userLogin="")
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());

            ViewData["Meters"] = user.AdminPrivileges? _DataManager.MetRepo.Meters(): user.Meters;
            if (user.AdminPrivileges && !userLogin.IsNullOrWhiteSpace())
                ViewData["Meters"] = _DataManager.UserRepo.GetUser(userLogin)?.Meters;

            ViewData["UserLogin"] = userLogin;

            return View();
        }
        public void ExportMeterList(string userLogin = "")
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());

            List<Meter> list = (user.AdminPrivileges ? _DataManager.MetRepo.Meters() : user.Meters).ToList();
            if (user.AdminPrivileges && !userLogin.IsNullOrWhiteSpace())
                list = _DataManager.UserRepo.GetUser(userLogin)?.Meters.ToList();

            string filename = "meterList.xlsx";

            DataManager.ExportToExcel(filename, new []{DataManager.GetDataTable(list)});

            ExportResponce(filename);
        }

        public ActionResult Meter(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                return View("Error");

            ViewData["Meter"] = met;

            return View();
        }
        public void ExportMeter(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                throw new MemberAccessException();

            string filename = "meter.xlsx";

            List<string[,]> toExport = new List<string[,]>
            {
                DataManager.GetDataTable(new[] {met}),
                DataManager.GetDataTable(met.Documents),
                DataManager.GetDataTable(met.Readings),
                DataManager.GetDataTable(met.Parametrs)
            };

            DataManager.ExportToExcel(filename, toExport.ToArray());

            ExportResponce(filename);
        }

        public ActionResult UserList()
        {
            ViewData["Users"] = _DataManager.UserRepo.Users();

            return View();
        }
        public void ExportUserList()
        {
            string fileName = "userList.xlsx";

            DataManager.ExportToExcel(fileName, new []{DataManager.GetDataTable(_DataManager.UserRepo.Users())}); 
            ExportResponce(fileName);
        }

        public ActionResult UserInfo(string UserLogin="")
        {
            if (UserLogin == null)
                return HttpNotFound();

            User currentUser = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());

            if (!UserLogin.IsNullOrWhiteSpace() && !currentUser.AdminPrivileges)
                return HttpNotFound();

            ViewData["User"] = UserLogin.IsNullOrWhiteSpace()? currentUser : _DataManager.UserRepo.GetUser(UserLogin);

            return View();
        }
        public void ExportUser(string UserLogin = "")
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());

            if (user.Login!=UserLogin)
            if (!UserLogin.IsNullOrWhiteSpace() && !user.AdminPrivileges)
                throw new MemberAccessException();

            User us = UserLogin.IsNullOrWhiteSpace() ? user : _DataManager.UserRepo.GetUser(UserLogin);

            List<string[,]> toExport = new List<string[,]>
            {
                DataManager.GetDataTable(new[] {us}),
                DataManager.GetDataTable(us?.Meters)
            };

            string fileName = "user.xlsx";
            DataManager.ExportToExcel(fileName, toExport);
            ExportResponce(fileName);
        }

        public ActionResult TariffList()
        {
            ViewData["Tariffes"] = _DataManager.TarRepo.Tariffs();

            return View();
        }
        public void ExportTariffList()
        {
            string fileName = "tariffList.xlsx";
            DataManager.ExportToExcel(fileName, new[]{DataManager.GetDataTable(_DataManager.TarRepo.Tariffs())});
            ExportResponce(fileName);
        }

        public ActionResult TimeSpans(int TariffId)
        {
            Tariff tar = _DataManager.TarRepo.GetTariff(TariffId);

            ViewData["TariffId"] = TariffId;
            ViewData["TariffName"] = tar.Name;
            ViewData["TimeSpans"] = tar.TimeSpans;

            return View();
        }
        public void ExportTimeSpanList(int TariffId)
        {
            Tariff tar = _DataManager.TarRepo.GetTariff(TariffId);

            string fileName = "timespanList.xlsx";
            DataManager.ExportToExcel(fileName, new[]{DataManager.GetDataTable(new []{tar})});
            ExportResponce(fileName);
        }

        public ActionResult TypeList()
        {
            ViewData["Types"] = _DataManager.TypeRepo.Types();

            return View();
        }
        public void ExportTypesList()
        {
            string fileName = "typeList.xlsx";
            DataManager.ExportToExcel(fileName, new [] {DataManager.GetDataTable(_DataManager.TypeRepo.Types())});
            ExportResponce(fileName);
        }

        public ActionResult ParameterList()
        {
            ViewData["Parameters"] = _DataManager.ParRepo.Parametrs();

            return View();
        }
        public void ExportParameterList()
        {
            string fileName = "parametrList.xlsx";
            DataManager.ExportToExcel(fileName, new [] {DataManager.GetDataTable(_DataManager.ParRepo.Parametrs())});
            ExportResponce(fileName);
        }

        public ActionResult Parameters(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                return View("Error");

            ViewData["MeterId"] = MeterId;
            ViewData["MeterName"] = met.Name;
            ViewData["Parameters"] = met.Parametrs;

            return View();
        }
        public void ExportParameters(string MeterId)
        {
            if (!long.TryParse(MeterId, out long  meterId)) return;

            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(meterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                throw new MemberAccessException();

            string fileName = "parameters.xlsx";
            DataManager.ExportToExcel(fileName, new []{DataManager.GetDataTable(met.Parametrs)});
            ExportResponce(fileName);
        }

        public ActionResult Readings(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                return View("Error");

            ViewData["MeterId"] = MeterId;
            ViewData["MeterName"] = met.Name;
            ViewData["ReadingsUnit"] = met.Type.Unit;
            ViewData["Readings"] = met.Readings;

            return View();
        }
        public void ExportReadings(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                throw new MemberAccessException();

            string fileName = "readings.xlsx";
            DataManager.ExportToExcel(fileName, new []{DataManager.GetDataTable(met.Readings)});
            ExportResponce(fileName);
        }

        public ActionResult DocumentList(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                return View("Error");

            ViewData["MeterId"] = MeterId;
            ViewData["MeterName"] = met.Name;
            ViewData["Documents"] = met.Documents;

            return View();
        }
        public void ExportDocuments(long MeterId)
        {
            User user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString());
            Meter met = _DataManager.MetRepo.GetMeter(MeterId);

            if (!user.AdminPrivileges && met.User.Login != user.Login)
                throw new MemberAccessException();

            string fileName = "documents.xlsx";
            DataManager.ExportToExcel(fileName, new[] {DataManager.GetDataTable(met.Documents)});
            ExportResponce(fileName);
        }
    }
}