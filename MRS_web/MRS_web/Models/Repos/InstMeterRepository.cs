using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;
using Type = MRS_web.Models.EDM.Type;

namespace MRS_web.Models.Repos
{
    public class InstMeterRepository
    {
        private ModelContainer1  cont;

        public InstMeterRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<InstalledMeter> InstMaterss()
        {
            return (from m in cont.MeterSet orderby m.ProductionId select m as InstalledMeter);
        }

        public InstalledMeter GetInstMeter(long id)
        {
            Meter met = cont.MeterSet.Find(id);
            return met as InstalledMeter;
        }

        public void EditMeter(long meterId, InstalledMeter.Fields fieldToEdit, string value)
        {
            InstalledMeter met = GetInstMeter(meterId);

            if (met == null)
                return;

            switch (fieldToEdit)
            {
                case InstalledMeter.Fields.ExpirationDate:
                    if (DateTime.TryParse(value, out DateTime dtVal) && met.ExpirationDate != dtVal)
                        met.ExpirationDate = dtVal;
                    break;
                default:
                    throw new NotImplementedException();
            }

            cont.SaveChanges();
        }

        public void Add(string name, string description, double capacity, long productionId, DateTime productionDate, DateTime expirationDate, ICollection<Parametr> parameters, Tariff tariff, Type type, ICollection<Document> documents, User user, ICollection<Reading> readings)
        {
            InstalledMeter met = new InstalledMeter();

            met.Name = name;
            met.Discription = description;
            met.Capacity = capacity;
            met.ProductionId = productionId;
            met.ProductionDate = productionDate;
            met.InstallDate= DateTime.Now;
            met.ExpirationDate = expirationDate;

            foreach (var parameter in parameters)
                parameter.Meters.Add(met);

            met.Parametrs = parameters;

            tariff.Meters.Add(met);
            met.Tariff = tariff;

            type.Meters.Add(met);
            met.Type = type;

            foreach (var document in documents)
                document.Meter = met;
            met.Documents = documents;

            user.Meters.Add(met);
            met.User = user;

            met.SumReadings = 0;
            foreach (var reading in readings)
            {
                reading.Meter = met;
                met.SumReadings += reading.Value;
            }
            met.Readings = readings;

            cont.SaveChanges();
        }
    }
}