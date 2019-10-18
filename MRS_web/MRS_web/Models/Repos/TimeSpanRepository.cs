using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;
using TimeSpan = MRS_web.Models.EDM.TimeSpan;

namespace MRS_web.Models.Repos
{
    public class TimeSpanRepository
    {
        private ModelContainer1  cont;

        public TimeSpanRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<TimeSpan> TimeSpans()
        {
            return (from t in cont.TimeSpanSet orderby t.TimeStart select t);
        }

        public TimeSpan GetTimeSpan(int id)
        {
            return cont.TimeSpanSet.Find(id);
        }

        //TODO: добавление удаление edit
    }
}