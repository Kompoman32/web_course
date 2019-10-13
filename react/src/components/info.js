import React from "react";
import {getMenuButtons, getGameButtonImage, getmapTile, tileNames} from "../store/stores";

function shrinkGameButtonImage (className, index){
    const image = getGameButtonImage(className, index);

    const positionArr = image.backgroundPosition.split(' ');
    const X = Number(positionArr[0].slice(0,positionArr[0].length-2)) / image.height * 40;
    const Y = Number(positionArr[1].slice(0,positionArr[1].length-2)) / image.width * 40;

    return {backgroundImage: image.backgroundImage,
        backgroundSize:"200px 200px", backgroundPosition: `${X}px ${Y}px`,
        height: 40, width: 40, }
}
function shrinkgetMenuButtons (index){
    const image = getMenuButtons(index);

    const positionArr = image.backgroundPosition.split(' ');
    const X = Number(positionArr[0].slice(0,positionArr[0].length-2)) / image.height * 30;
    const Y = Number(positionArr[1].slice(0,positionArr[1].length-2)) / image.width * 30;

    return {backgroundImage: image.backgroundImage,
        backgroundSize:`150px 90px`, backgroundPosition: `${X}px ${Y}px`,
        height: 30, width: 30, }
}

export default function Info(props){
    return(
        <div  style={{position:"relative"}}>
            <button style={{position: "absolute", right:10, padding:2}} onClick={() => props.onClick()} >✖</button>
            <div className="flex-column">
                <div id="infoDiv" className="flex-column margin-5">
                    <h1 style={{marginBottom:10, marginTop:0}}>
                        Танковый биатлон
                    </h1>
                    <div className="flex-row flex-align-start">
                        <div className="flex-column flex-align-start">
                            <div style={{padding:10, border:"1px dashed black",}}>
                                <p>
                                    Игра «Танковый Биатлон» предназначена для знакомства с параллельным программированием.
                                </p>
                                <p>
                                    Вы управляете экипажем боевого танка на биатлонной трасе,
                                    задачей которого является поражение всех
                                    мишеней на игровом поле за минимальное количество ходов.
                                </p>
                                <h2>
                                    Вы управляете тремя исполнителями:
                                </h2>
                                <ul>
                                    <li>Наводчик - управляет орудием</li>
                                    <li>Водитель - управляет движением танка</li>
                                    <li>Заряжающий - управляет зарядом орудия</li>
                                </ul>
                                <h2>
                                    Ваша цель состоит в следующем:
                                </h2>
                                <p>
                                    Написать последовательность команд (алгоритм) для параллельной работы всех трёх исполнителей,
                                    чтобы совместная деятельность привела к уничтожению всех мишеней и выполнению их боевой задачи.
                                </p>
                                <p>
                                    Все команды в строке выполняются одновременно
                                    (На самом деле сначала команда Наводчика,
                                    затем Водителя, затем Заряжающего).
                                </p>
                                <p>
                                    Выстрел можно сделать только после зарядки орудий (статус заряда показывается
                                    прямоугольникком около танка). Зарядка происходит в два действия, сначала необходимо
                                    выполнить команду «Заряжай 1», а затем «Заряжай 2».
                                </p>
                                <h2>
                                    На игровом поле расположены различные препятсвия:
                                </h2>
                                <ul>
                                    <li>
                                        <img style={getmapTile(tileNames.mountains, 30)} alt=""/> {` `}
                                        Камни - нельзя проехать, нельзя прострелить
                                    </li>
                                    <li>
                                        <img style={getmapTile(tileNames.swamp, 30)} alt=""/> {` `}
                                        Деревья - нельзя проехать, можно прострелить
                                    </li>
                                </ul>
                                <h2>
                                    Цели для поражения имеют различное количества выстрелов для уничтожения:
                                </h2>
                                <ul>
                                    <li>
                                        <img style={getmapTile(tileNames._3hp, 30)} alt=""/> {` `}
                                        Большая мишень - 3 выстрела
                                    </li>
                                    <li>
                                        <img style={getmapTile(tileNames._2hp, 30)} alt=""/> {` `}
                                        Средняя мишень - 2 выстрела
                                    </li>
                                    <li>
                                        <img style={getmapTile(tileNames._1hp, 30)} alt=""/> {` `}
                                        Малая мишень - 1 выстрел
                                    </li>
                                </ul>
                            </div>
                            <div style={{padding:10, border:"1px dashed black"}}>
                                <h2>
                                    Некоторые действия выполнять нельзя:
                                </h2>
                                <ul>
                                    <li>
                                        Нельзя наехать на препятсвия или цели
                                    </li>
                                    <li>
                                        Нельзя выехать за границы поля
                                    </li>
                                    <li>
                                        Нельзя выстрелить пока орудие не заряжено
                                    </li>
                                    <li>
                                        Нельзя сменить направление движения танка на противоположное после движения,
                                        необходимо сделать паузу между движениями. (пример: нельзя выполнить
                                        «Подвинуться вперёд», а затем «Повинуться назад»)
                                    </li>
                                    <li>
                                        Нельзя выполнить команду «Заряжай 1», если уже была выполнена эта команда
                                        или орудие заряжено.
                                        (Можно выполнять одновременно с командой «Выстрел», если орудие заряжено)
                                    </li>
                                    <li>
                                        Нельзя выполнить команду «Заряжай 2», если орудие уже заряжено
                                        или команда «Заряжай 1» не была выполнена.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex-column flex-align-start">
                            <div style={{padding:10, border:"1px dashed black"}}>
                                <h1>
                                    Комадны для исполнителей:
                                </h1>
                                <h2>
                                    Наводчик:
                                </h2>
                                <ul>
                                        <li>
                                            <img style={shrinkGameButtonImage("gunner",0)} alt=""/> {` `}
                                            <img style={shrinkGameButtonImage("gunner",1)} alt=""/> {` `}
                                            <img style={shrinkGameButtonImage("gunner",2)} alt=""/> {` `}
                                            - поворот орудия по часовой стрелке на 45°, 90° и 135°
                                        </li>
                                        <li>
                                            <img style={shrinkGameButtonImage("gunner",3)} alt=""/> {` `}
                                            <img style={shrinkGameButtonImage("gunner",4)} alt=""/> {` `}
                                            <img style={shrinkGameButtonImage("gunner",5)} alt=""/> {` `}
                                            - поворот орудия против часовой стрелки на 45°, 90° и 135°
                                        </li>
                                        <li>
                                            <img style={shrinkGameButtonImage("gunner",7)} alt=""/> {` `}
                                            - выстрел
                                        </li>
                                        <li>
                                            <img style={shrinkGameButtonImage("gunner",8)} alt=""/> {` `}
                                            - пауза
                                        </li>
                                    </ul>
                                <h2>
                                    Водитель:
                                </h2>
                                <ul>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",0)} alt=""/> {` `}
                                        <img style={shrinkGameButtonImage("driver",1)} alt=""/> {` `}
                                        <img style={shrinkGameButtonImage("driver",2)} alt=""/> {` `}
                                        - поворот танка по часовой стрелке на 45°, 90° и 135°
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",3)} alt=""/> {` `}
                                        <img style={shrinkGameButtonImage("driver",4)} alt=""/> {` `}
                                        <img style={shrinkGameButtonImage("driver",5)} alt=""/> {` `}
                                        - поворот танка против часовой стрелки на 45°, 90° и 135°
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",7)} alt=""/> {` `}
                                        - подвинуться вперёд
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",8)} alt=""/> {` `}
                                        - подвинуться назад
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",9)} alt=""/> {` `}
                                        - повернуть на 45° по часовой стрелке и подвинуться вперёд
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",10)} alt=""/> {` `}
                                        - повернуть на 45° против часовой стрелки и подвинуться вперёд
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("driver",11)} alt=""/> {` `}
                                        - пауза
                                    </li>
                                </ul>
                                <h2>
                                    Заряжающий:
                                </h2>
                                <ul>
                                    <li>
                                        <img style={shrinkGameButtonImage("charger",0)} alt=""/> {` `}
                                        - зарядить первую половину
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("charger",1)} alt=""/> {` `}
                                        - зарядить вторую половину
                                    </li>
                                    <li>
                                        <img style={shrinkGameButtonImage("charger",2)} alt=""/> {` `}
                                        - пауза
                                    </li>
                                </ul>
                            </div>
                            <div style={{padding:10, border:"1px dashed black"}}>
                                <h2>
                                    Кнопки управления:
                                </h2>
                                <ul>
                                    <li>
                                        <img style={shrinkgetMenuButtons(0)} alt=""/> {` `}
                                        - выполнить весь алгоритм
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(1)} alt=""/> {` `}
                                        - приостановить выполнение
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(2)} alt=""/> {` `}
                                        - остановить выполнение или сбросить
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(3)} alt=""/> {` `}
                                        - выполнить алгоритм до выбранной строки (красной)
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(4)} alt=""/> {` `}
                                        - выполнить строку и перейти к следующей
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(5)} alt=""/> {` `}
                                        - сохранить файл
                                    </li>
                                    <li>
                                        <img style={shrinkgetMenuButtons(6)} alt=""/> {` `}
                                        - загрузить файл
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
