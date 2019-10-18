using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;
using Type = MRS_web.Models.EDM.Type;
using User = MRS_web.Models.EDM.User;
using Parametr = MRS_web.Models.EDM.Parametr;

namespace MRS_web.Models.Repos
{
    public class MeterRepository
    {
        private ModelContainer1  cont;

        public MeterRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<Meter> Meters()
        {
            return (from m in cont.MeterSet orderby m.ProductionId select m);
        }

        public Meter GetMeter(long id)
        {
            return cont.MeterSet.Find(id);
        }

        public void Edit(long meterId, Meter.Fields fieldToEdit, string value)
        {
            Meter met = GetMeter(meterId);

            switch (fieldToEdit)
            {
                case Meter.Fields.Name:
                    if (met.Name != value)
                        met.Name = value;
                    break;
                case Meter.Fields.Discription:
                    if (met.Discription != value)
                        met.Discription = value;
                    break;
                case Meter.Fields.SumReadings:
                  { if (double.TryParse(value, out double doubleVal) && met.SumReadings != doubleVal)
                        met.SumReadings = doubleVal;}
                    break;

                case Meter.Fields.Capacity:
                  { if (double.TryParse(value, out double doubleVal) && met.Capacity != doubleVal)
                        met.Capacity = doubleVal;}
                    break;

                case Meter.Fields.ProductionDate:
                    if (DateTime.TryParse(value, out DateTime dtValue) && met.ProductionDate != dtValue)
                        met.ProductionDate = dtValue;
                    break;

                default:
                    throw new NotImplementedException();
            }

            cont.SaveChanges();
        }

        public void DeleteMeter(long meterId)
        {
            Meter met = GetMeter(meterId);

            {
                DocumentRepository docRepo = new DocumentRepository(cont);

                foreach (Document doc in met.Documents)
                {
                    docRepo.DeleteDocument(doc.Id);
                }
            }

            {
                ReadingRepository readRepo = new ReadingRepository(cont);

                foreach (Reading reading in met.Readings)
                {
                    readRepo.DeleteReading(reading.Id);
                }
            }

            met.User.Meters.Remove(met);

            cont.MeterSet.Remove(met);

            cont.SaveChanges();
        }

        public void Add(string name, string description, double capacity, long productionId, DateTime productionDate, ICollection<Parametr> parameters, Tariff tariff, Type type, ICollection<Document> documents, User user, ICollection<Reading> readings)
        {
            Meter met = new Meter();

            met.Name = name;
            met.Discription = description;
            met.Capacity = capacity;
            met.ProductionId = productionId;
            met.ProductionDate = productionDate;

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