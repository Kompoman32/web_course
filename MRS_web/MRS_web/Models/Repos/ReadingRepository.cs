using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;

namespace MRS_web.Models.Repos
{
    public class ReadingRepository
    {
        private ModelContainer1  cont;

        public ReadingRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<Reading> Readings()
        {
            return (from t in cont.ReadingSet orderby t.Meter.ProductionId select t);
        }

        public Reading GetReading(long id)
        {
            return cont.ReadingSet.Find(id);
        }

        public void DeleteReading(long id)
        {
            Reading read = GetReading(id);

            read.Meter.Readings.Remove(read);

            cont.ReadingSet.Remove(read);

            cont.SaveChanges();
        }

        //TODO: добавление edit
    }
}