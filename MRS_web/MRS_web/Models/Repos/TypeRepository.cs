using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;
using Type = MRS_web.Models.EDM.Type;

namespace MRS_web.Models.Repos
{
    public class TypeRepository
    {
        private ModelContainer1  cont;

        public TypeRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<Type> Types()
        {
            return (from t in cont.TypeSet orderby t.Name select t);
        }

        public Type GetType(int id)
        {
            return cont.TypeSet.Find(id);
        }

        //TODO: добавление удаление edit
    }
}