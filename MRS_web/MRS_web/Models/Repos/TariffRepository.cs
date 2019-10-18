using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;

namespace MRS_web.Models.Repos
{
    public class TariffRepository
    {
        private ModelContainer1  cont;

        public TariffRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<Tariff> Tariffs()
        {
            return (from t in cont.TariffSet orderby t.Id select t);
        }

        public Tariff GetTariff(int id)
        {
            return cont.TariffSet.Find(id);
        }

        //TODO: добавление удаление(x) edit
    }
}