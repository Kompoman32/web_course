using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;

namespace MRS_web.Models.Repos
{
    public class ParametrRepository
    {
        private ModelContainer1  cont;

        public ParametrRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<Parametr> Parametrs()
        {
            return (from p in cont.ParametrSet orderby p.Name select p);
        }

        public Parametr GetParametr(int id)
        {
            return cont.ParametrSet.Find(id);
        }

        public void DeleteParametr(int id)
        {
            Parametr par = GetParametr(id);

            foreach (Meter met in par.Meters)
                met.Parametrs.Remove(par);
            
            cont.ParametrSet.Remove(par);

            cont.SaveChanges();
        }

        //TODO: добавление edit
    }
}