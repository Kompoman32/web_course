using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using Microsoft.Ajax.Utilities;
using MRS_web.Models;
using MRS_web.Models.EDM;
using TimeSpan = MRS_web.Models.EDM.TimeSpan;
using Type = MRS_web.Models.EDM.Type;

namespace MRS_web.Models
{
    class RequestConstructor
    {
        // поля
        /*          СЧётчик
                
                    string = Название
                    string = Описание
                    Float = Сумма показаний
                    Float = Размерность табло
                    Integer = Заводской номер
                    date = Дата производства
                    coll = Параметры
                    entity" name="Tariff = Тариф        
                    entity" name="string = Тип          
                    coll = Документы
                    entity" name="User = Пользователь   
                    coll = Показания
                
            
            
                Уст.Счётчик
                
                    date = Дата установки
                    date = Дата проверки
                    coll = Врем. промежутки
                
            
            
                Пользователь
                
                    string = Логин
                    string = Полное Имя
                    bool = Администратор?
                    coll = Счётчики
                
            
            
                Тип
                
                    string = Название
                    string = Ед. измерения
                    coll = Счётчики
                
            
            
                Показатель
                
                    Float = Значение
                    Integer = Номер тарифа
                    entity" name="Meter = Счётчик
                
            
            
                Параметр
                
                    string = Название
                    string = Значение
                    coll = Счётчики
                
            
            
                Тариф
                
                    string = Название
                    coll = Счётчики
                    coll = Врем. промежутки
                
            
            
                Врем. промежуток
                
                    string = Название
                    time = Время начала
                    time = Время окончания
                    entity" name="Tariff = Тариф
                
            
            
                Документ
                
                    string = Заголовок
                    string = Описание
                    date = Дата подписания
                    entity" name="Meter = Счётчик
               
         */

        /*Счётчик*/
        private static Dictionary<string, Dictionary<string, Func<Meter, string, bool>>> MeterDict =
            new Dictionary<string, Dictionary<string, Func<Meter, string, bool>>>
            {
                {
                    "Название", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Name == inp},
                        {"!=", (t, inp) => t.Name != inp}
                    }
                },
                {
                    "Описание", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Discription == inp},
                        {"!=", (t, inp) => t.Discription != inp}
                    }
                },
                {
                    "Сумма показаний", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.SumReadings.Equals(double.Parse(inp))},
                        {"!=", (t, inp) => !t.SumReadings.Equals(double.Parse(inp))},
                        {">", (t, inp) => t.SumReadings > double.Parse(inp)},
                        {"<", (t, inp) => t.SumReadings < double.Parse(inp)},
                        {">=", (t, inp) => t.SumReadings >= double.Parse(inp)},
                        {"<=", (t, inp) => t.SumReadings <= double.Parse(inp)}
                    }
                },
                {
                    "Размерность табло", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Capacity.Equals(double.Parse(inp))},
                        {"!=", (t, inp) => !t.Capacity.Equals(double.Parse(inp))},
                        {">", (t, inp) => t.Capacity > double.Parse(inp)},
                        {"<", (t, inp) => t.Capacity < double.Parse(inp)},
                        {">=", (t, inp) => t.Capacity >= double.Parse(inp)},
                        {"<=", (t, inp) => t.Capacity <= double.Parse(inp)}
                    }
                },
                {
                    "Заводской номер", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.ProductionId.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.ProductionId.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.ProductionId > int.Parse(inp)},
                        {"<", (t, inp) => t.ProductionId < int.Parse(inp)},
                        {">=", (t, inp) => t.ProductionId >= int.Parse(inp)},
                        {"<=", (t, inp) => t.ProductionId <= int.Parse(inp)}
                    }
                },
                {
                    "Дата производства", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.ProductionDate.Equals(DateTime.Parse(inp))},
                        {"!=", (t, inp) => !t.ProductionDate.Equals(DateTime.Parse(inp))},
                        {">", (t, inp) => t.ProductionDate > DateTime.Parse(inp)},
                        {"<", (t, inp) => t.ProductionDate < DateTime.Parse(inp)},
                        {">=", (t, inp) => t.ProductionDate >= DateTime.Parse(inp)},
                        {"<=", (t, inp) => t.ProductionDate <= DateTime.Parse(inp)}
                    }
                },
                {
                    "Параметры", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Parametrs.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Parametrs.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Parametrs.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Parametrs.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Parametrs.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Parametrs.Count <= int.Parse(inp)}
                    }
                },
                // inp содержит весь путь до поля сущности без первого Entity и первого поля, пример (в классе Meter):  Name.Value
                // Entity
                {
                    "Тариф", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {
                            "==", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))][">"](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))][">="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },

                    }
                },
                // Entity
                {
                    "Тип", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {
                            "==", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))][">"](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))][">="](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => TypeDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.Type,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                    }
                },
                {
                    "Документы", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Documents.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Documents.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Documents.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Documents.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Documents.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Documents.Count <= int.Parse(inp)}
                    }
                },
                // Entity
                {
                    "Пользователь", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {
                            "==", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))][">"](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))][">="](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => UserDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.User,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                    }
                },
                {
                    "Показания", new Dictionary<string, Func<Meter, string, bool>>
                    {
                        {"==", (t, inp) => t.Readings.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Readings.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Readings.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Readings.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Readings.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Readings.Count <= int.Parse(inp)}
                    }
                }
            };

        /*Уст. Счётчик*/
         static Dictionary<string, Dictionary<string, Func<InstalledMeter, string, bool>>> InstMeterDict =
            new Dictionary<string, Dictionary<string, Func<InstalledMeter, string, bool>>>
            {
                {
                    "Дата установки", new Dictionary<string, Func<InstalledMeter, string, bool>>
                    {
                        {"==", (t, inp) => t.InstallDate.Equals(DateTime.Parse(inp))},
                        {"!=", (t, inp) => !t.InstallDate.Equals(DateTime.Parse(inp))},
                        {">", (t, inp) => t.InstallDate > DateTime.Parse(inp)},
                        {"<", (t, inp) => t.InstallDate < DateTime.Parse(inp)},
                        {">=", (t, inp) => t.InstallDate >= DateTime.Parse(inp)},
                        {"<=", (t, inp) => t.InstallDate <= DateTime.Parse(inp)}
                    }
                },
                {
                    "Дата проверки", new Dictionary<string, Func<InstalledMeter, string, bool>>
                    {
                        {"==", (t, inp) => t.ExpirationDate.Equals(DateTime.Parse(inp))},
                        {"!=", (t, inp) => !t.ExpirationDate.Equals(DateTime.Parse(inp))},
                        {">", (t, inp) => t.ExpirationDate > DateTime.Parse(inp)},
                        {"<", (t, inp) => t.ExpirationDate < DateTime.Parse(inp)},
                        {">=", (t, inp) => t.ExpirationDate >= DateTime.Parse(inp)},
                        {"<=", (t, inp) => t.ExpirationDate <= DateTime.Parse(inp)}
                    }
                }
            };

        /*Пользователь*/
         static Dictionary<string, Dictionary<string, Func<User, string, bool>>> UserDict =
            new Dictionary<string, Dictionary<string, Func<User, string, bool>>>
            {
                {
                    "Логин", new Dictionary<string, Func<User, string, bool>>
                    {
                        {"==", (t, inp) => t.Login.Equals(inp)},
                        {"!=", (t, inp) => !t.Login.Equals(inp)},
                    }
                },
                {
                    "Полное Имя", new Dictionary<string, Func<User, string, bool>>
                    {
                        {"==", (t, inp) => t.FullName.Equals(inp)},
                        {"!=", (t, inp) => !t.FullName.Equals(inp)},
                    }
                },
                {
                    "Администратор?", new Dictionary<string, Func<User, string, bool>>
                    {
                        {"==", (t, inp) => t.AdminPrivileges.Equals(bool.Parse(inp))},
                        {"!=", (t, inp) => !t.AdminPrivileges.Equals(bool.Parse(inp))},
                    }
                },
                {
                    "Счётчики", new Dictionary<string, Func<User, string, bool>>
                    {
                        {"==", (t, inp) => t.Meters.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Meters.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Meters.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Meters.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Meters.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Meters.Count <= int.Parse(inp)}
                    }
                },
            };

        /*Тип*/
         static Dictionary<string, Dictionary<string, Func<Type, string, bool>>> TypeDict =
            new Dictionary<string, Dictionary<string, Func<Type, string, bool>>>
            {
                {
                    "Название", new Dictionary<string, Func<Type, string, bool>>
                    {
                        {"==", (t, inp) => t.Name.Equals(inp)},
                        {"!=", (t, inp) => !t.Name.Equals(inp)},
                    }
                },
                {
                    "Ед. измерения", new Dictionary<string, Func<Type, string, bool>>
                    {
                        {"==", (t, inp) => t.Unit.Equals(inp)},
                        {"!=", (t, inp) => !t.Unit.Equals(inp)},
                    }
                },
                {
                    "Счётчики", new Dictionary<string, Func<Type, string, bool>>
                    {
                        {"==", (t, inp) => t.Meters.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Meters.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Meters.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Meters.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Meters.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Meters.Count <= int.Parse(inp)}
                    }
                },
            };

        /*Показатель*/
         static Dictionary<string, Dictionary<string, Func<Reading, string, bool>>> ReadingDict =
            new Dictionary<string, Dictionary<string, Func<Reading, string, bool>>>
            {
                {
                    "Значение", new Dictionary<string, Func<Reading, string, bool>>
                    {
                        {"==", (t, inp) => t.Value.Equals(double.Parse(inp))},
                        {"!=", (t, inp) => !t.Value.Equals(double.Parse(inp))},
                        {">", (t, inp) => t.Value > double.Parse(inp)},
                        {"<", (t, inp) => t.Value < double.Parse(inp)},
                        {">=", (t, inp) => t.Value >= double.Parse(inp)},
                        {"<=", (t, inp) => t.Value <= double.Parse(inp)}
                    }
                },
                {
                    "Номер тарифа", new Dictionary<string, Func<Reading, string, bool>>
                    {
                        {"==", (t, inp) => t.TariffNumber.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.TariffNumber.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.TariffNumber > int.Parse(inp)},
                        {"<", (t, inp) => t.TariffNumber < int.Parse(inp)},
                        {">=", (t, inp) => t.TariffNumber >= int.Parse(inp)},
                        {"<=", (t, inp) => t.TariffNumber <= int.Parse(inp)}
                    }
                },
                // Entity
                {
                    "Счётчик", new Dictionary<string, Func<Reading, string, bool>>
                    {
                        {
                            "==", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))][">"](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))][">="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                    }
                },
            };

        /*Параметр*/
         static Dictionary<string, Dictionary<string, Func<Parametr, string, bool>>> ParametrDict =
            new Dictionary<string, Dictionary<string, Func<Parametr, string, bool>>>
            {
                {
                    "Название", new Dictionary<string, Func<Parametr, string, bool>>
                    {
                        {"==", (t, inp) => t.Name.Equals(inp)},
                        {"!=", (t, inp) => !t.Name.Equals(inp)},
                    }
                },
                {
                    "Значение", new Dictionary<string, Func<Parametr, string, bool>>
                    {
                        {"==", (t, inp) => t.Measure.Equals(inp)},
                        {"!=", (t, inp) => !t.Measure.Equals(inp)},
                    }
                },
                {
                    "Счётчики", new Dictionary<string, Func<Parametr, string, bool>>
                    {
                        {"==", (t, inp) => t.Meters.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Meters.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Meters.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Meters.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Meters.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Meters.Count <= int.Parse(inp)}
                    }
                },
            };

        /*Тариф*/
         static Dictionary<string, Dictionary<string, Func<Tariff, string, bool>>> TariffDict =
            new Dictionary<string, Dictionary<string, Func<Tariff, string, bool>>>
            {
                {
                    "Название", new Dictionary<string, Func<Tariff, string, bool>>
                    {
                        {"==", (t, inp) => t.Name.Equals(inp)},
                        {"!=", (t, inp) => !t.Name.Equals(inp)},
                    }
                },
                {
                    "Счётчики", new Dictionary<string, Func<Tariff, string, bool>>
                    {
                        {"==", (t, inp) => t.Meters.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.Meters.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.Meters.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.Meters.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.Meters.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.Meters.Count <= int.Parse(inp)}
                    }
                },
                {
                    "Врем. промежутки", new Dictionary<string, Func<Tariff, string, bool>>
                    {
                        {"==", (t, inp) => t.TimeSpans.Count.Equals(int.Parse(inp))},
                        {"!=", (t, inp) => !t.TimeSpans.Count.Equals(int.Parse(inp))},
                        {">", (t, inp) => t.TimeSpans.Count > int.Parse(inp)},
                        {"<", (t, inp) => t.TimeSpans.Count < int.Parse(inp)},
                        {">=", (t, inp) => t.TimeSpans.Count >= int.Parse(inp)},
                        {"<=", (t, inp) => t.TimeSpans.Count <= int.Parse(inp)}
                    }
                },
            };

        /*Врем. промежуток*/
         static Dictionary<string, Dictionary<string, Func<TimeSpan, string, bool>>> TimeSpanDict =
            new Dictionary<string, Dictionary<string, Func<TimeSpan, string, bool>>>
            {
                {
                    "Название", new Dictionary<string, Func<TimeSpan, string, bool>>
                    {
                        {"==", (t, inp) => t.Name.Equals(inp)},
                        {"!=", (t, inp) => !t.Name.Equals(inp)},
                    }
                },
                {
                    "Время начала", new Dictionary<string, Func<TimeSpan, string, bool>>
                    {
                        {"==", (t, inp) => t.TimeStart.Equals(System.TimeSpan.Parse(inp))},
                        {"!=", (t, inp) => !t.TimeStart.Equals(System.TimeSpan.Parse(inp))},
                        {">", (t, inp) => t.TimeStart > System.TimeSpan.Parse(inp)},
                        {"<", (t, inp) => t.TimeStart < System.TimeSpan.Parse(inp)},
                        {">=", (t, inp) => t.TimeStart >= System.TimeSpan.Parse(inp)},
                        {"<=", (t, inp) => t.TimeStart <= System.TimeSpan.Parse(inp)}
                    }
                },
                {
                    "Время окончания", new Dictionary<string, Func<TimeSpan, string, bool>>
                    {
                        {"==", (t, inp) => t.TimeEnd.Equals(System.TimeSpan.Parse(inp))},
                        {"!=", (t, inp) => !t.TimeEnd.Equals(System.TimeSpan.Parse(inp))},
                        {">", (t, inp) => t.TimeEnd > System.TimeSpan.Parse(inp)},
                        {"<", (t, inp) => t.TimeEnd < System.TimeSpan.Parse(inp)},
                        {">=", (t, inp) => t.TimeEnd >= System.TimeSpan.Parse(inp)},
                        {"<=", (t, inp) => t.TimeEnd <= System.TimeSpan.Parse(inp)}
                    }
                },
                // Entity
                {
                    "Тариф", new Dictionary<string, Func<TimeSpan, string, bool>>
                    {
                        {
                            "==", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))][">"](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))][">="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => TariffDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.Tariff,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                    }
                },
            };

        /*Документ*/
         static Dictionary<string, Dictionary<string, Func<Document, string, bool>>> DocumentDict =
            new Dictionary<string, Dictionary<string, Func<Document, string, bool>>>
            {
                {
                    "Заголовок", new Dictionary<string, Func<Document, string, bool>>
                    {
                        {"==", (t, inp) => t.Title.Equals(inp)},
                        {"!=", (t, inp) => !t.Title.Equals(inp)},
                    }
                },
                {
                    "Описание", new Dictionary<string, Func<Document, string, bool>>
                    {
                        {"==", (t, inp) => t.Discription.Equals(inp)},
                        {"!=", (t, inp) => !t.Discription.Equals(inp)},
                    }
                },
                {
                    "Дата подписания", new Dictionary<string, Func<Document, string, bool>>
                    {
                        {"==", (t, inp) => t.SigningDate.Equals(DateTime.Parse(inp))},
                        {"!=", (t, inp) => !t.SigningDate.Equals(DateTime.Parse(inp))},
                        {">", (t, inp) => t.SigningDate > DateTime.Parse(inp)},
                        {"<", (t, inp) => t.SigningDate < DateTime.Parse(inp)},
                        {">=", (t, inp) => t.SigningDate >= DateTime.Parse(inp)},
                        {"<=", (t, inp) => t.SigningDate <= DateTime.Parse(inp)}
                    }
                },
                // Entity
                {
                    "Счётчик", new Dictionary<string, Func<Document, string, bool>>
                    {
                        {
                            "==", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["=="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "!=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["!="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))][">"](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["<"](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            ">=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))][">="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                        {
                            "<=", (t, inp) => MeterDict[inp.Remove(inp.IndexOf('\t'))]["<="](t.Meter,inp.Substring(inp.IndexOf('\t') + 1))
                        },
                    }
                },
            };

        static IEnumerable<Meter> meters;
        static IEnumerable<InstalledMeter> instmeters ;
        static IEnumerable<Tariff> tariffs;
        static IEnumerable<User> users;
        static IEnumerable<Reading> readings;
        static IEnumerable<Document> documents;
        static IEnumerable<Type> types;
        static IEnumerable<Parametr> paparametrs;
        static IEnumerable<TimeSpan> timespans;

        public RequestConstructor(DataManager _dm)
        {
            meters = _dm.MetRepo.Meters();
            instmeters = _dm.InstMetRepo.InstMaterss();
            tariffs = _dm.TarRepo.Tariffs();
            users = _dm.UserRepo.Users().Union(_dm.UserRepo.Admins());
            readings = _dm.ReadRepo.Readings();
            documents = _dm.DocRepo.Documents();
            types = _dm.TypeRepo.Types();
            paparametrs = _dm.ParRepo.Parametrs();
            timespans = _dm.TimeSpanRepo.TimeSpans();
        }

        static string entity = "";

        static System.Type GiveType()
        {
            switch (entity)
            {
                case "Счётчик":
                    return typeof(Meter);
                case "Уст. Счётчик":
                    return typeof(InstalledMeter);
                case "Пользователь":
                    return typeof(User);
                case "Тип":
                    return typeof(Type);
                case "Показатель":
                    return typeof(Reading);
                case "Параметр":
                    return typeof(Parametr);
                case "Тариф":
                    return typeof(Tariff);
                case "Врем. промежуток":
                    return typeof(TimeSpan);
                case "Документ":
                    return typeof(Document);
            }

            return typeof(object);
        }

        public IEnumerable<IConstructor> GiveCollection(string req, out System.Type type)
        {
            //req =
            //"&start=(&start=(&Entity=Счётчик&String=Название&Sign=!=&Input=3&end=)&Or=И&Entity=Счётчик&String=Название&Sign=!=&Input=Вода&end=)";
            //"&start=(&start=(&Entity=Пользователь&Bool=Администратор?&Sign=!=&Input=FALSE&end=)end=)";
            req += "&";
            entity = req.Substring(req.IndexOf("&Entity=")+8).Remove(req.Substring(req.IndexOf("&Entity=") + 8).IndexOf('&'));
            type = GiveType();
            switch (entity)
            {
                case "Счётчик":
                    return NewExpr(ref req);
                case "Уст. счётчик":
                    return NewExpr(ref req);
                case "Пользователь":
                    return NewExpr(ref req);
                case "Тип":
                    return NewExpr(ref req);
                case "Показатель":
                    return NewExpr(ref req);
                case "Параметр":
                    return NewExpr(ref req);
                case "Тариф":
                    return NewExpr(ref req);
                case "Врем. промежуток":
                    return NewExpr(ref req);
                case "Документ":
                    return NewExpr(ref req);
            }

            return null;
        }

        static IEnumerable<IConstructor> NewExpr(ref string req)
        {
            string first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            string key = first.Substring(1, first.IndexOf('=') - 1);
            string value = first.Substring(first.IndexOf('=') + 1);

            req = req.Remove(0, first.Length);

            IEnumerable<IConstructor> temp;

            if (key == "start")
            {
                temp = NewExpr(ref req);
            }
            //Property
            else
            {
                //Dictionary<string, string > properties = entities[value];
                
                temp = Property(ref req);
            }

            if (req == "&") return temp;

            first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            key = first.Substring(1, first.IndexOf('=') - 1);
            value = first.Substring(first.IndexOf('=') + 1);

            if (key == "end")
            {
                req = req.Remove(0, first.Length);
                return temp;
            }

            return Logic(ref req, temp);
        }

        static IEnumerable<IConstructor> Logic(ref string req, IEnumerable<IConstructor> A)
        {
            string first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            string key = first.Substring(1, first.IndexOf('=') - 1);
            string value = first.Substring(first.IndexOf('=') + 1);

            if (key != "Logic") return A;

            req = req.Remove(0, first.Length);

            if (value == "ИЛИ")
            {
                return NewExpr(ref req).Union(A);
            }
            else
            {
                return NewExpr(ref req).Intersect(A);
            }
        }
        
        static IEnumerable<IConstructor> Property(ref string req)
        {
            string first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            string key = first.Substring(1, first.IndexOf('=') - 1);
            string outputValue = first.Substring(first.IndexOf('=') + 1);

            req = req.Remove(0, first.Length);

            string property = "";
            int counter = 0; // счётчик чтоб долго не бродил малол ли нет Sign

            while (true)
            {
                first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
                key = first.Substring(1, first.IndexOf('=') - 1);
                if (key == "Sign")
                    break;
                string value = first.Substring(first.IndexOf('=') + 1);

                req = req.Remove(0, first.Length);

                property += '\t' + value;
                
                if (counter++>100)
                    throw new LockRecursionException();
            }

            return Sign(ref req, outputValue, property.TrimStart('.'));
        }

        static IEnumerable<IConstructor> Sign(ref string req, string property, string fullVal="")
        {
            string first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            string key = first.Substring(1, first.IndexOf('=') - 1);
            string value = first.Substring(first.IndexOf('=') + 1);
            req = req.Remove(0, first.Length);

            value = value.Replace("Количество ", "");
            
            return Input(ref req, value, property, fullVal);
            
        }

        static IEnumerable<IConstructor> Input(ref string req, string sign, string property, string value="")
        {
            string first = req.Remove(req.Remove(0, 1).IndexOf('&') + 1);
            string key = first.Substring(1, first.IndexOf('=') - 1);
                   value += '\t' + first.Substring(first.IndexOf('=') + 1);

            value = value.TrimStart('\t');
            if(value.IsNullOrWhiteSpace())
                throw new ArgumentNullException();

            req = req.Remove(0, first.Length);
            
            switch (entity)
            {
                case "Счётчик":
                    return meters.Where(t => MeterDict[property][sign](t, value));
                case "Уст. счётчик":
                    return instmeters.Where(t => InstMeterDict[property][sign](t, value));
                case "Пользователь":
                    return users.Where(t => UserDict[property][sign](t, value));
                case "Тип":
                    return types.Where(t => TypeDict[property][sign](t, value));
                case "Показатель":
                    return readings.Where(t => ReadingDict[property][sign](t, value));
                case "Параметр":
                    return paparametrs.Where(t => ParametrDict[property][sign](t, value));
                case "Тариф":
                    return tariffs.Where(t => TariffDict[property][sign](t, value));
                case "Врем. промежуток":
                    return timespans.Where(t => TimeSpanDict[property][sign](t, value));
                case "Документ":
                    return documents.Where(t => DocumentDict[property][sign](t, value));
            }
            return null;
        }
    }
}
