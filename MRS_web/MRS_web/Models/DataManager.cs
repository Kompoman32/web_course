using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using MainLib;
using MRS_web.Models.EDM;
using Type = MRS_web.Models.EDM.Type;
using TimeSpan = MRS_web.Models.EDM.TimeSpan;
using MRS_web.Models.Repos;

namespace MRS_web.Models
{
    public class DataManager
    {
        ModelContainer1  cont;

        public UserRepository UserRepo;
        public MeterRepository MetRepo;
        public InstMeterRepository InstMetRepo;
        public ParametrRepository ParRepo;
        public TypeRepository TypeRepo;
        public ReadingRepository ReadRepo;
        public TariffRepository TarRepo;
        public TimeSpanRepository TimeSpanRepo;
        public DocumentRepository DocRepo;


        public DataManager()
        {
            cont = new ModelContainer1();
            UserRepo = new UserRepository(cont);
            MetRepo = new MeterRepository(cont);
            InstMetRepo = new InstMeterRepository(cont);
            ParRepo = new ParametrRepository(cont);
            TypeRepo = new TypeRepository(cont);
            ReadRepo = new ReadingRepository(cont);
            TarRepo = new TariffRepository(cont);
            TimeSpanRepo = new TimeSpanRepository(cont);
            DocRepo = new DocumentRepository(cont);
        }

        //public static IEnumerable<string[,]> GetDataTables(params IEnumerable[] collections)
        //{
        //    if (collections == null) return null;

        //    List<string[,]> array = new List<string[,]>();

        //    foreach (IEnumerable collection in collections)
        //        array.Add(GetDataTable(collection));
            
        //    return array;
        //}

        public static string[,] GetDataTable<T>(IEnumerable<T> collection)
        {
            if (collection == null || !collection.Any()) return new string[0,0];
            
            var first = collection.First();

            return
                first is Meter
                    ? Meter.GetDataTableOfMeters(collection.Cast<Meter>())
                    : first is Document
                        ? Document.GetDataTableOfDocuments(collection.Cast<Document>())
                        : first is Parametr
                            ? Parametr.GetDataTableOfParametrs(collection.Cast<Parametr>())
                            : first is Reading
                                ? Reading.GetDataTableOfReadings(collection.Cast<Reading>())
                                : first is Tariff
                                    ? Tariff.GetDataTableOfTariffs(collection.Cast<Tariff>())
                                    : first is TimeSpan
                                        ? TimeSpan.GetDataTableOfTimeSpans(collection.Cast<TimeSpan>())
                                        : first is Type
                                            ? Type.GetDataTableOfTypes(collection.Cast<Type>())
                                            : first is User
                                                ? User.GetDataTableOfUsers(collection.Cast<User>())
                                                : new string[0, 0];

        }

        public static void ExportToExcel(string fileName, IEnumerable<string[,]> toExport)
        {
            MainLib.ExportImport.Export.ToExcel($"C:\\c#\\MRS_web\\MRS_web\\Output_Excel\\{fileName}", toExport);
        }
    }
}