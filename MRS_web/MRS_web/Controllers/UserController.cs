﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using MRS_web.Models;
using MRS_web.Models.EDM;

namespace MRS_web.Controllers
{
    [AuthorizeUser]
    public class UserController : Controller
    {
        DataManager _DataManager;

        public UserController(DataManager dm)
        {
            _DataManager = dm;
        }

        public ActionResult Index()
        {
            return View();
        }

        #region AddMeter

        private void AddMeterInitFields()
        {
            Session["AddMetUser"] = Request.Form["User"] != null && Request.Form["User"] != "" ? Request.Form["User"] : Session["AddMetUser"];
            Session["AddMetName"] = Request.Form["Name"] != null && Request.Form["Name"] != "" ? Request.Form["Name"] : Session["AddMetName"];
            Session["AddMetDescription"] = Request.Form["Description"] != null && Request.Form["Description"] != "" ? Request.Form["Description"] : Session["AddMetDescription"];
            Session["AddMetCapacityBefComma"] = Request.Form["CapacityBefComma"] != null && Request.Form["CapacityBefComma"] != "" ? Request.Form["CapacityBefComma"] : Session["AddMetCapacityBefComma"];
            Session["AddMetCapacityAftComma"] = Request.Form["CapacityAftComma"] != null && Request.Form["CapacityAftComma"] != "" ? Request.Form["CapacityAftComma"] : Session["AddMetCapacityAftComma"];
            Session["AddMetProductionId"] = Request.Form["ProductionId"] != null && Request.Form["ProductionId"] != "" ? Request.Form["ProductionId"] : Session["AddMetProductionId"];
            Session["AddMetProductionDate"] = Request.Form["ProductionDate"] != null && Request.Form["ProductionDate"] != "" ? Request.Form["ProductionDate"] : Session["AddMetProductionDate"];
            Session["AddMetTypeId"] = Request.Form["TypeId"] != null && Request.Form["TypeId"] != "" ? Request.Form["TypeId"] : Session["AddMetTypeId"];
            Session["AddMetTariffId"] = Request.Form["TariffId"] != null && Request.Form["TariffId"] != "" ? Request.Form["TariffId"] : Session["AddMetTariffId"];
            Session["AddMetReadings"] = Request.Form["Reading"] != null && Request.Form["Reading"] != "" ? Request.Form["Reading"] : Session["AddMetReadings"];
            Session["AddMetParameters"] = Request.Form["MeterParameters"] != null && Request.Form["MeterParameters"] != "" ? Request.Form["MeterParameters"] : Session["AddMetParameters"];


            ViewData["User"] = Session["AddMetUser"];
            ViewData["Name"] = Session["AddMetName"];
            ViewData["Description"] = Session["AddMetDescription"];
            ViewData["Capacity"] = Session["AddMetCapacity"];
            ViewData["CapacityBefComma"] = Session["AddMetCapacityBefComma"];
            ViewData["CapacityAftComma"] = Session["AddMetCapacityAftComma"];
            ViewData["ProductionId"] = Session["AddMetProductionId"];
            ViewData["ProductionDate"] = Session["AddMetProductionDate"];
            ViewData["Types"] = _DataManager.TypeRepo.Types();
            ViewData["TypeId"] = Session["AddMetTypeId"];
            ViewData["Tariffs"] = _DataManager.TarRepo.Tariffs();
            ViewData["TariffId"] = Session["AddMetTariffId"];
            ViewData["Readings"] = Session["AddMetReadings"];
            ViewData["Documents"] = Session["AddMetDocuments"] ?? new List<Document>();
            ViewData["MeterParameters"] = Session["AddMetrParameters"];
            ViewData["StockParameters"] = ViewData["MeterParameters"] != null
                ? from par in _DataManager.ParRepo.Parametrs()
                  where !(ViewData["MeterParameters"] as IEnumerable<Parametr>).Select(x => x.Id).Contains(par.Id)
                  select par
                : _DataManager.ParRepo.Parametrs();
        }

        private void ClearSession()
        {
            Session.Remove("AddMetUser");
            Session.Remove("AddMetName");
            Session.Remove("AddMetDescription");
            Session.Remove("AddMetCapacityBefComma");
            Session.Remove("AddMetCapacityAftComma");
            Session.Remove("AddMetProductionId");
            Session.Remove("AddMetProductionDate");
            Session.Remove("AddMetTypeId");
            Session.Remove("AddMetTariffId");
            Session.Remove("AddMetReadings");
            Session.Remove("AddMetParameters");
        }

        [HttpGet]
        public ActionResult AddMeter()
        {
            AddMeterInitFields();
            return View();
        }

        [HttpPost]
        public ActionResult AddMeter( string Name, string Description, int? TypeId, int? CapacityBefComma, int? CapacityAftComma, long? ProductionId, DateTime? ProductionDate, int? TariffId, string[] Reading, string[] meterParameters)
        {
            AddMeterInitFields();

            string user = _DataManager.UserRepo.GetUser(Session["UserLogin"].ToString()).Login;

            if (!CheclFields(user, Name, Description, TypeId, CapacityBefComma, CapacityAftComma, ProductionId, ProductionDate,
                TariffId, Reading, meterParameters))
                return View();

            double Capacity = double.Parse((new string('9', (int)CapacityBefComma) + ',' +
                                            new string('9', (int)CapacityAftComma)).TrimEnd('.'));
            List<Document> docs = Session["AddMetDocuments"] as List<Document>;

            List<Parametr> parameters = new List<Parametr>();
            foreach (var parId in meterParameters)
                parameters.Add(_DataManager.ParRepo.GetParametr(int.Parse(parId)));

            List<Reading> readings = new List<Reading>();
            int counter = 1;
            foreach (var read in Reading)
                readings.Add(new Reading { TariffNumber = counter++, Value = double.Parse(read) });


            _DataManager.MetRepo.Add(Name, Description, Capacity, (long)ProductionId, (DateTime)ProductionDate, parameters, _DataManager.TarRepo.GetTariff((int)TariffId), _DataManager.TypeRepo.GetType((int)TypeId), docs, _DataManager.UserRepo.GetUser(user), readings);

            ClearSession();

            return RedirectToAction("Meter", "Database", new { MeterId = ProductionId });

        }

        private bool CheclFields(string User, string Name, string Description, int? TypeId, int? CapacityBefComma, int? CapacityAftComma,
                                 long? ProductionId, DateTime? ProductionDate, int? TariffId, string[] Reading, string[] meterParameters)
        {
            if (string.IsNullOrWhiteSpace(Name))
                ModelState.AddModelError("Name", "Заполните поле");

            if (string.IsNullOrWhiteSpace(Description))
                ModelState.AddModelError("Description", "Заполните поле");

            if (CapacityBefComma == null)
                ModelState.AddModelError("CapacityBefComma", "Заполните поле");

            if (CapacityAftComma == null)
                ModelState.AddModelError("CapacityAftComma", "Заполните поле");

            if (ProductionId == null)
                ModelState.AddModelError("ProductionId", "Заполните поле");

            if (ProductionId != null && (from m in _DataManager.MetRepo.Meters() where m.ProductionId == ProductionId select m).Any())
                ModelState.AddModelError("ProductionId", "Счётчик с таким номером уже существует");

            if (ProductionDate == null)
                ModelState.AddModelError("ProductionDate", "Заполните поле верной датой");

            if (ProductionDate != null && ProductionDate > DateTime.Now)
                ModelState.AddModelError("ProductionDate", "Дата производства, не может быть больше текущей");

            if (TariffId != null)
                for (int i = 0; i < TariffId; i++)
                {
                    if (Reading[i].IsNullOrWhiteSpace())
                        ModelState.AddModelError("Reading" + i, "Заполните поле");

                    if (CapacityBefComma != null && Reading[i].TrimEnd('0', '1', '2', '3', '4', '5', '6', '7', '8', '9').TrimEnd('.', ',').Length > CapacityBefComma)
                        ModelState.AddModelError("Reading" + i, "Значение не может быть больше размерности");
                }

            return ModelState.IsValid;
        }

        public ActionResult Tariffes(string Count)
        {
            if (Count != null)
            {
                return PartialView("PartialViews/Tarifes", int.Parse(Count));
            }
            return HttpNotFound();
        }


        public ActionResult NewDocumentSave(string Title, string Discription, DateTime? Date)
        {
            //TODO Проверку
            var t = Session["AddMetDocuments"] as IEnumerable<Document>;
            Document doc = new Document() { Discription = Discription, SigningDate = (DateTime)Date, Title = Title };

            var documents = t != null ? new List<Document>(t) : new List<Document>();
            documents.Add(doc);
            Session["AddMetDocuments"] = documents;

            return PartialView("PartialViews/Documents", documents);
        }

        public ActionResult RemoveDocuments(string[] documentId)
        {
            List<Document> t = Session["AddMetDocuments"] as List<Document>;
            if (t == null) t = new List<Document>();

            foreach (var s in documentId)
            {
                t.RemoveAt(int.Parse(s));
            }

            Session["AddMetDocuments"] = t;

            return PartialView("PartialViews/Documents", t);
        }

        #endregion AddMeter

    }
}