import {createStore} from "redux";
import {rootReducer} from "./reducers.js"

export const tileNames = {
    mountains: "mountains",
    swamp: "swamp",
    littleMountains: "littleMountains",
    littleSwamp: "littleSwamp",
    trailVert: "trailVert",
    trailDiag: "trailDiag",
    littleTrailVert: "littleTrailVert",
    littleTrailDiag: "littleTrailDiag",
    tankBody: "tankBody",
    tankHead: "tankHead",
    tankStatus_NotLoaded: "tankStatus_NotLoaded",
    tankStatus_PartLoaded: "tankStatus_PartLoaded",
    tankStatus_Loaded: "tankStatus_Loaded",
    _3hp: "3hp",
    _2hp: "2hp",
    _1hp: "1hp",
    empty: "empty"
};

export const getmapTile = (type, anotherTileSize, little = false) =>{
    if (store + "" === "undefined")
        return {};
    let tS = anotherTileSize || store.getState().mapState.tileSize; //tileSize
    let obj = {};
    switch (type) {
        case tileNames.mountains:
        case tileNames.littleMountains:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS}px 0px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.swamp:
        case tileNames.littleSwamp:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 2}px 0px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.tankBody:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 3}px 0px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.tankHead:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 4}px 0px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.tankStatus_NotLoaded:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 3}px -${tS * 2}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.tankStatus_PartLoaded:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 4}px -${tS * 2}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.tankStatus_Loaded:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 4}px -${tS * 3}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames._3hp:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `0px -${tS}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames._2hp:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS}px -${tS}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames._1hp:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 2}px -${tS}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.trailVert:
            console.log(1);
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 3}px -${tS}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.littleTrailVert:
            little = true;
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 3 * 3 + tS }px -${tS * 3 }px`,
                height: tS + 2*3,
                width: tS,};
            tS *= 3;

            break;
        case tileNames.trailDiag:
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 4}px -${tS}px`,
                height: tS,
                width: tS,};
            break;
        case tileNames.littleTrailDiag:
            little = true;
            obj = {
                tag: type,
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: `-${tS * 4 * 3 + tS}px -${tS * 3}px`,
                height: tS + 2*3,
                width: tS,};
            tS *= 3;

            break;
        default:
            obj = {
                tag: "empty",
                backgroundImage: "url('../images/gametiles.svg')",
                backgroundPosition: "0px 0px",
                height: tS,
                width: tS,};
            break;
    }
    if (little){
        const positionArr = obj.backgroundPosition.split(' ');
        const X = Number(positionArr[0].slice(0,positionArr[0].length-2)) / 3;
        const Y = Number(positionArr[1].slice(0,positionArr[1].length-2)) / 3;

        obj = { ...obj,
            backgroundPosition: `${Math.floor(X)}px ${Math.floor(Y)}px`,
            backgroundSize: `${tS * 5 / 3 + 2 }px ${tS * 5 / 3 + 2 }px`,
            height: obj.height / 3, width: obj.width / 3 ,
            border:"none", }
    }
    else{
        obj = {...obj, backgroundSize: `${tS * 5}px ${tS * 5}px`,}
    }


    return obj;
};

export const gunnerBtnsCount =9;
export const driverBtnsCount =12;
export const chargerBtnsCount =3;

export const gameButtons = {
    gunner:{
        North: "PauseGunner",
        East: "TurnTurretClockwise90",
        South: "TurnTurretAround",
        West: "TurnTurretCounterClockwise90",
        NorthWest: "TurnTurretCounterClockwise45",
        NorthEast: "TurnTurretClockwise45",
        SouthWest: "TurnTurretCounterClockwise135",
        SouthEast: "TurnTurretClockwise135",
        Fire: "FireCommand",
        Pause: "PauseGunner"
    },
    driver:{
        North: "StopDriver",
        East: "TurnTankClockwise90",
        South: "TurnTankAround",
        West: "TurnTankCounterClockwise90",
        NorthWest: "TurnTankCounterClockwise45",
        NorthEast: "TurnTankClockwise45",
        SouthWest: "TurnTankCounterClockwise135",
        SouthEast: "TurnTankClockwise135",
        MoveForward: "MoveForward",
        MoveBackward: "MoveBackward",
        TurnLeftAndMoveForward: "TurnTankCounterClockwiseAndMoveForward",
        TurnRightAndMoveForward: "TurnTankClockwiseAndMoveForward",
        TurnLeftAndMoveBackward: "=TBD=",
        TurnRightAndMoveBackward: "=TBD=",
        Stop: "StopDriver",
        Pause: "StopDriver"
    },
    charger:{
        NotLoaded: 0,
        PartiallyLoaded: 1,
        Ready:2,
        Pause: "PauseLoader"

    }
};

export function getGameButtonImage(className, index) {

    if (isNaN(index)){
        switch (className) {
            case "gunner":
                switch (index) {
                    case gameButtons.gunner.NorthEast:
                        index = 0;
                        break;
                    case gameButtons.gunner.East:
                        index = 1;
                        break;
                    case gameButtons.gunner.SouthEast:
                        index = 2;
                        break;
                    case gameButtons.gunner.NorthWest:
                        index = 3;
                        break;
                    case gameButtons.gunner.West:
                        index = 4;
                        break;
                    case gameButtons.gunner.SouthWest:
                        index = 5;
                        break;
                    case gameButtons.gunner.South:
                        index = 6;
                        break;
                    case gameButtons.gunner.Fire:
                        index = 7;
                        break;
                    default:
                        index = 8
                }
                break;
            case "driver":
                switch (index) {
                    case gameButtons.driver.NorthEast:
                        index = 0;
                        break;
                    case gameButtons.driver.East:
                        index = 1;
                        break;
                    case gameButtons.driver.SouthEast:
                        index = 2;
                        break;
                    case gameButtons.driver.NorthWest:
                        index = 3;
                        break;
                    case gameButtons.driver.West:
                        index = 4;
                        break;
                    case gameButtons.driver.SouthWest:
                        index = 5;
                        break;
                    case gameButtons.driver.South:
                        index = 6;
                        break;
                    case gameButtons.driver.MoveForward:
                        index = 7;
                        break;
                    case gameButtons.driver.MoveBackward:
                        index = 8;
                        break;
                    case gameButtons.driver.TurnRightAndMoveForward:
                        index = 9;
                        break;
                    case gameButtons.driver.TurnLeftAndMoveForward:
                        index = 10;
                        break;
                    default:
                        index = 11;
                }
                break;
            case "charger":
                switch (index) {
                    case "LoadTurret_" + gameButtons.charger.PartiallyLoaded:
                        index = 0;
                        break;
                    case "LoadTurret_" +  gameButtons.charger.Ready:
                        index = 1;
                        break;
                    default:
                        index = 2;
                }
                break;
        }
    }


    return {... [
        //-----------------Gunner----------------------
        {
            tag:gameButtons.gunner.NorthEast,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "0px 0px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.East,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-70px 0px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.SouthEast,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-140px 0px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.NorthWest,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "0px -70px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.West,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-70px -70px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.SouthWest,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-140px -70px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.South,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "0px -140px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.Fire,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-140px -140px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.gunner.Pause,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px -210px",
            left: 0,
            height: 70,
            width: 70,},
        //---------------Driver------------
        {
            tag:gameButtons.driver.NorthEast,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "0px -210px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.East,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-70px -210px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.SouthEast,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-140px -210px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.NorthWest,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "0px -280px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.West,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-70px -280px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.SouthWest,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-140px -280px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.South,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-70px -140px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.MoveForward,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px 0px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.MoveBackward,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-280px 0px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.TurnRightAndMoveForward,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px -70px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.TurnLeftAndMoveForward,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-280px -70px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.driver.Pause,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px -210px",
            left: 0,
            height: 70,
            width: 70,},
        //-----------------Charger--------------
        {
            tag:gameButtons.charger.PartiallyLoaded,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px -140px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.charger.Ready,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-280px -140px",
            left: 0,
            height: 70,
            width: 70,},
        {
            tag:gameButtons.charger.Pause,
            backgroundImage: "url('../images/actionbtns.svg')",
            backgroundPosition: "-210px -210px",
            left: 0,
            height: 70,
            width: 70,},
    ][index + (className === "driver" ? gunnerBtnsCount : 0) + ( className === "charger" ? gunnerBtnsCount + driverBtnsCount : 0 )]
        , backgroundSize: "350px 350px"}
}

export function getMenuButtons(index){
    return [
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "0px 0px",
            left: 0,
            backgroundSize: "200px 120px",
            height: 40,
            width: 40,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-40px 0px",
            left: 0,
            backgroundSize: "200px 120px",
            height: 40,
            width: 40,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-80px 0px",
            left: 0,
            backgroundSize: "200px 120px",
            height: 40,
            width: 40,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-120px 0px",
            left: 0,
            backgroundSize: "200px 120px",
            height: 40,
            width: 40,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-160px 0px",
            left: 0,
            backgroundSize: "200px 120px",
            height: 40,
            width: 40,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "0px -30px",
            left: 0,
            backgroundSize: "150px 90px",
            height: 30,
            width: 30,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-30px -30px",
            left: 0,
            backgroundSize: "150px 90px",
            height: 30,
            width: 30,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-60px -30px",
            left: 0,
            backgroundSize: "150px 90px",
            height: 30,
            width: 30,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-60px -20px",
            left: 0,
            backgroundSize: "100px 60px",
            height: 20,
            width: 20,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "-80px -20px",
            left: 0,
            backgroundSize: "100px 60px",
            height: 20,
            width: 20,},
        {
            backgroundImage: "url('../images/menubtns.svg')",
            backgroundPosition: "0px -60px",
            left: 0,
            backgroundSize: "150px 90px",
            height: 30,
            width: 30,},
    ][index]
}

export function getAngleByDirection(direction){
    switch (direction) {
        case gameButtons.driver.North:
        case gameButtons.gunner.North:
            return 0;
        case gameButtons.driver.East:
        case gameButtons.gunner.East:
            return 90;
        case gameButtons.driver.South:
        case gameButtons.gunner.South:
            return 180;
        case gameButtons.driver.West:
        case gameButtons.gunner.West:
            return -90;
        case gameButtons.driver.NorthWest:
        case gameButtons.gunner.NorthWest:
            return -45;
        case gameButtons.driver.NorthEast:
        case gameButtons.gunner.NorthEast:
            return 45;
        case gameButtons.driver.SouthWest:
        case gameButtons.gunner.SouthWest:
            return -135;
        case gameButtons.driver.SouthEast:
        case gameButtons.gunner.SouthEast:
            return 135;
    }
    return 0;
}

export function transformAngle(angle) {
    if (angle > 180 )
        return angle - 360;

    if (angle < -180 )
        return angle + 360;

    if (angle === 180 || angle === -180)
        return 180;

    return angle;
}

export function getDirectionByAngle(className, angle){
    angle = transformAngle(angle);

    switch (angle) {
        case 0:
            return gameButtons[`${className}`].North;
        case 90:
            return gameButtons[`${className}`].East;
        case 180:
            return gameButtons[`${className}`].South;
        case -90:
            return gameButtons[`${className}`].West;
        case -45:
            return gameButtons[`${className}`].NorthWest;
        case 45:
            return gameButtons[`${className}`].NorthEast;
        case -135:
            return gameButtons[`${className}`].SouthWest;
        case 135:
            return gameButtons[`${className}`].SouthEast;
    }
    return "undefined";
}

export const initialState_Code ={
    gunnerSelectedIndex: 0,
    driverSelectedIndex: 0,
    chargerSelectedIndex: 0,
    selectedRow: 0,
    currentRow: 0,
    rows: [{
        gunner: null,
        driver: null,
        charger: null
    }],
    isPlay: false,
    isPause: false,
    speed: 500,

};

const testMap=`<?xml version="1.0" encoding="utf-8"?>
<World Height="10" Width="10" ShellDistance="8">
  <Tank X="4" Y="4">
    <TankDirection>North</TankDirection>
    <TurretDirection>North</TurretDirection>
    <TurretStatus>NotLoaded</TurretStatus>
  </Tank>
  <Units>
    <LittlePillbox X="4" Y="2" />
    <BigPillbox X="7" Y="1" />
    <Rock X="5" Y="2" />
    <LittleRock X="6" Y="2" XShift="-1" YShift="1" />
    <LittleRock X="6" Y="2" XShift="0" YShift="0" />
    <LittleRock X="6" Y="2" XShift="1" YShift="-1" />
    <LittleRock X="7" Y="2" XShift="0" YShift="-1" />
    <LittleRock X="7" Y="2" XShift="0" YShift="0" />
    <LittleRock X="7" Y="2" XShift="0" YShift="1" />
    <Swamp X="3" Y="3" />
    <Swamp X="4" Y="3" />
    <Swamp X="5" Y="3" />
    <LittleSwamp X="6" Y="2" XShift="-1" YShift="0" />
    <LittleSwamp X="6" Y="2" XShift="-1" YShift="-1" />
    <LittleSwamp X="6" Y="2" XShift="0" YShift="-1" />
    <LittleSwamp X="6" Y="2" XShift="1" YShift="0" />
    <LittleSwamp X="6" Y="2" XShift="1" YShift="1" />
    <LittleSwamp X="6" Y="2" XShift="0" YShift="1" />
    <LittleSwamp X="7" Y="2" XShift="-1" YShift="0" />
    <LittleSwamp X="7" Y="2" XShift="-1" YShift="-1" />
    <LittleSwamp X="7" Y="2" XShift="-1" YShift="1" />
    <LittleSwamp X="7" Y="2" XShift="1" YShift="-1" />
    <LittleSwamp X="7" Y="2" XShift="1" YShift="0" />
    <LittleSwamp X="7" Y="2" XShift="1" YShift="1" />
    <LittleSwamp X="6" Y="3" XShift="-1" YShift="1" />
    <LittleSwamp X="6" Y="3" XShift="0" YShift="0" />
    <LittleSwamp X="6" Y="3" XShift="1" YShift="-1" />
    <LittleSwamp X="6" Y="3" XShift="0" YShift="-1" />
    <LittleSwamp X="6" Y="3" XShift="-1" YShift="-1" />
    <LittleSwamp X="6" Y="3" XShift="-1" YShift="0" />
    <LittleSwamp X="6" Y="3" XShift="1" YShift="0" />
    <LittleSwamp X="7" Y="3" XShift="-1" YShift="-1" />
    <LittleSwamp X="7" Y="3" XShift="0" YShift="-1" />
  </Units>
</World>`;


const intitalTileSize = 40;

export const initialState_Map = {
    tileSize:intitalTileSize,
    initialMap: testMap,
    mapTracers: [],
    map:[],
    targetCount:0
};

export const initialState = {
    codeState: initialState_Code,
    mapState: initialState_Map
};

export const store = createStore(rootReducer, initialState);


