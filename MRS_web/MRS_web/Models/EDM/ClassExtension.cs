using System.Collections.Generic;
using System.Linq;
using MainLib;

namespace MRS_web.Models.EDM
{
    public interface IConstructor { }

    public partial class Document: IConstructor
    {
        public enum Fields { Title, Discription, SigningDate, Meter}

        public override string ToString()
        {
            return this.SigningDate.ToString("d") + " - " + this.Title;
        }

        public static string[,] GetDataTableOfDocuments(IEnumerable<Document> collection)
        {
            collection = collection ?? new Document[0];
            List<Document> list = new List<Document>(collection);

            object[] headers =
            {
                "Номер счётчика", "Заголовок", "Дата подписания", "Описание"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Meter.ProductionId;
                mas[i, 1] = list[i].Title;
                mas[i, 2] = list[i].SigningDate.ToString("d");
                mas[i, 3] = list[i].Discription;
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class Meter : IConstructor
    {
        public enum Fields { Name, Discription, SumReadings, Capacity, ProductionId, ProductionDate, Parametrs, Tariff, Type, Documents, User, Readings}

        public static string[,] GetDataTableOfMeters(IEnumerable<Meter> collection)
        {
            collection = collection ?? new Meter[0];
            List<Meter> list = new List<Meter>(collection);

            object[] headers =
            {
                "Владелец", "Название", "Заводской номер", "Дата производства", "Дата Установки",
                "Дата следующей проверки"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].User.Login;
                mas[i, 1] = list[i].Name;
                mas[i, 2] = list[i].ProductionId;
                mas[i, 3] = list[i].ProductionDate;
                mas[i, 4] = list[i] is InstalledMeter
                    ? ((InstalledMeter)list[i]).InstallDate.ToString("d")
                    : false.ToYesNo();
                mas[i, 5] = list[i] is InstalledMeter
                    ? ((InstalledMeter)list[i]).ExpirationDate.ToString("d")
                    : false.ToYesNo();
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }

        public override string ToString()
        {
            return this.ProductionId + " - " + this.Name;
        }
    }

    public partial class InstalledMeter : IConstructor
    {
        public new enum Fields { InstallDate, ExpirationDate}
    }

    public partial class Parametr : IConstructor
    {
        public enum Fields { Name, Measure, Meters}

        public override string ToString()
        {
            return this.Name + " - " + this.Measure;
        }

        public static string[,] GetDataTableOfParametrs(IEnumerable<Parametr> collection)
        {
            collection = collection ?? new Parametr[0];
            List<Parametr> list = new List<Parametr>(collection);

            object[] headers =
            {
                "Название", "Значение"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Name;
                mas[i, 1] = list[i].Measure;
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class Reading : IConstructor
    {
        public enum Fields { Value, TariffNumber, Meter}

        public override string ToString()
        {
            return this.Value + " " + Meter.Type.Unit;
        }

        public static string[,] GetDataTableOfReadings(IEnumerable<Reading> collection)
        {
            collection = collection ?? new Reading[0];
            List<Reading> list = new List<Reading>(collection);

            object[] headers =
            {
                "Номер счётчика", "Номер тарифа", "Значение", "Единица измерения"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Meter.ProductionId;
                mas[i, 1] = list[i].TariffNumber;
                mas[i, 2] = list[i].Value;
                mas[i, 3] = list[i].Meter.Type.Unit;
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class Tariff : IConstructor
    {
        public enum Fields { Name, Meters, TimeSpans}

        public override string ToString()
        {
            return this.Name;
        }

        public static string[,] GetDataTableOfTariffs(IEnumerable<Tariff> collection)
        {
            collection = collection ?? new Tariff[0];
            List<Tariff> list = new List<Tariff>(collection);

            object[] headers =
            {
                "Название", "Количество промежутков", "Промежутки"
            };

            object[,] mas = new object[list.Count, headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Name;
                mas[i, 1] = list[i].TimeSpans.Count;
                mas[i, 2] = list[i].TimeSpans;
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class TimeSpan : IConstructor
    {
        public enum Fields { Name, TimeStart, TimeEnd, Tariff}

        public override string ToString()
        {
            return $"[{TimeStart.Hours}:{TimeStart.Minutes} - {TimeEnd.Hours}:{TimeEnd.Minutes}]";
        }

        public static string[,] GetDataTableOfTimeSpans(IEnumerable<TimeSpan> collection)
        {
            collection = collection ?? new TimeSpan[0];
            List<TimeSpan> list = new List<TimeSpan>(collection);

            object[] headers =
            {
                "Название", "Время начала", "Время окончания"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Name;
                mas[i, 1] = $"{list[i].TimeStart.TotalHours} : {list[i].TimeStart.TotalMinutes}";
                mas[i, 2] = $"{list[i].TimeEnd.TotalHours} : {list[i].TimeEnd.TotalMinutes}";
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class Type : IConstructor
    {
        public enum Fields { Name, Unit, Meters}

        public override string ToString()
        {
            return this.Name + " (" + this.Unit + ")";
        }

        public static string[,] GetDataTableOfTypes(IEnumerable<Type> collection)
        {
            collection = collection ?? new Type[0];
            List<Type> list = new List<Type>(collection);

            object[] headers =
            {
                "Название", "Единица измерения"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].Name;
                mas[i, 1] = list[i].Unit;
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }

    public partial class User : IConstructor
    {
        public enum Fields { Login, Password, FullName, AdminPrivileges, Maters}

        public override string ToString()
        {
            return this.Login + " - " + this.FullName;
        }

        public static string[,] GetDataTableOfUsers(IEnumerable<User> collection)
        {
            collection = collection ?? new User[0];
            List<User> list = new List<User>(collection);

            object[] headers =
            {
                "Полное имя", "Логин", "Парва Администратора"
            };

            object[,] mas = new object[list.Count(), headers.Length];
            for (int i = 0; i < list.Count(); i++)
            {
                mas[i, 0] = list[i].FullName;
                mas[i, 1] = list[i].Login;
                mas[i, 2] = list[i].AdminPrivileges.ToYesNo();
            }

            mas = mas.InsertRowAt(headers, 0);

            return MainLib.Arrays.ToString(mas);
        }
    }
}