using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MRS_web.Models.EDM;

namespace MRS_web.Models.Repos
{
    public class UserRepository
    {
        private ModelContainer1  cont;

        public UserRepository(ModelContainer1 _cont)
        {
            cont = _cont;
        }

        public IEnumerable<User> Users()
        {
            return (from u in cont.UserSet where !u.AdminPrivileges orderby u.FullName select u);
        }

        public IEnumerable<User> Admins()
        {
            return (from u in cont.UserSet where u.AdminPrivileges orderby u.FullName select u);
        }

        public User GetUser(string login)
        {
            var req = (from u in cont.UserSet where u.Login == login select u);
            return req.Any() ? req.First():null;
        }

        public void DeleteUser(string login)
        {
            User us = GetUser(login);

            {
                MeterRepository metRepo = new MeterRepository(cont);

                foreach (Meter met in us.Meters)
                    metRepo.DeleteMeter(met.ProductionId);
            }

            cont.UserSet.Remove(us);

            cont.SaveChanges();
        }

        public void AddUser(string login, string password, string fullName, bool adminPriveleges = false)
        {
            User user = new User() { Login = login, Password = password, AdminPrivileges = adminPriveleges, FullName = fullName };

            cont.UserSet.Add(user);

            cont.SaveChanges();
        }

        //TODO: добавление удаление edit
    }
}