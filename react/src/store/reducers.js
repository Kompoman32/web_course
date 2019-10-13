import {bindActionCreators} from 'redux'
import {getGameButtonImage,
        tileNames,getmapTile,
        initialState, initialState_Map, initialState_Code} from "./stores.js";
import {actionsTypes, actionsCode, actionsMap_Code, actionsMap ,
        reduceHP, loadMap, zoomIn , zoomOut,
        RotateTank, RotateTurret,Load, Start, Stop, NextMove, Restart, Fire, Pause,SaveAlg, LoadAlg,
        IncreaseSpeed, DecreaseSpeed,ClearRows,
        MoveTankForward, MoveTankBackward, MoveTankRotateLeftAndForward,
        MoveTankRotateRightAndForward,
        addPictureInTD, changeSelectedButton, removePictureInTD, SelectRow,} from "./actions.js";
import {gameButtons, getAngleByDirection, getDirectionByAngle, transformAngle} from "./stores";


export const rootReducer = (state = initialState, action) =>{
    if (actionsTypes.MAP[`${action.type}`] +"" !== "undefined")
        return {...state, mapState: mapReducer(state.mapState, action)};

    if (actionsTypes.CODE[`${action.type}`]+"" !== "undefined")
        return {...state, codeState: codeReducer(state.codeState, action)};

    if (actionsTypes.MAP_CODE[`${action.type}`]+"" !== "undefined")
        return map_codeReducer(state, action);
    return state;
};

//-----------------------------------------------------------

export const codeReducer = (state = initialState_Code , action) => {
    switch (action.type) {
        case actionsCode.CHANGE_SELECTED_BUTTON:
        {
            const {index, className} = action.payload;

            if (className === "gunner") {
                return {
                    ...state,
                    gunnerSelectedIndex: index,
                }
            }
            if (className === "driver") {
                return {
                    ...state,
                    driverSelectedIndex: index,
                }
            }
            if (className === "charger") {
                return {
                    ...state,
                    chargerSelectedIndex: index,
                }
            }
            return state;
        }
        case actionsCode.ADD_PICTURE_IN_TD:
        {
            const rows = state.rows.slice();
            const { indexRow, className } = action.payload;

            rows[indexRow]={
                gunner: className === "gunner" ? getGameButtonImage("gunner", state.gunnerSelectedIndex ) : rows[indexRow].gunner,
                driver: className === "driver" ? getGameButtonImage("driver", state.driverSelectedIndex ) : rows[indexRow].driver,
                charger: className === "charger" ? getGameButtonImage("charger", state.chargerSelectedIndex ) : rows[indexRow].charger
            };

            while (
                rows[rows.length-1].gunner != null ||
                rows[rows.length-1].driver != null ||
                rows[rows.length-1].charger != null)
            {
                rows.push(
                    {
                        gunner: null,
                        driver: null,
                        charger: null
                    });
            }


            return {...state, rows: rows}
        }
        case actionsCode.REMOVE_PICTURE_IN_TD:
        {
            let rows = [...state.rows];
            const { indexRow, className } = action.payload;

            // console.log(state);
            // console.log(rows.length);
            // console.log(JSON.stringify(rows ));

            rows[indexRow] = {
                gunner: className === "gunner" ? null : rows[indexRow].gunner,
                driver: className === "driver" ? null : rows[indexRow].driver,
                charger: className === "charger" ? null : rows[indexRow].charger
            };

            // console.log(rows);

            while (
                rows.length > 0 &&
                rows[rows.length-1].gunner == null &&
                rows[rows.length-1].driver == null &&
                rows[rows.length-1].charger == null)
            {
                rows.pop();
            }
            rows.push(
                {
                    gunner: null,
                    driver: null,
                    charger: null
                });

            return {...state, rows: rows, selectedRow: Math.min(state.selectedRow, rows.length-1)}
        }
        case actionsCode.CLEAR:{
            return {
                ...state,  rows: [{gunner:null, driver:null, charger:null}],
                selectedRow: 0, currentRow:0
            }
        }
        default:
            break;
    }
    return state
};

export const putStateToProps_Code = (state) =>{

    return {
        gunnerSelectedIndex: state.codeState.gunnerSelectedIndex,
        driverSelectedIndex: state.codeState.driverSelectedIndex,
        chargerSelectedIndex: state.codeState.chargerSelectedIndex,
        selectedRow: state.codeState.selectedRow,
        currentRow: state.codeState.currentRow,
        rows: state.codeState.rows,
        isPlay: state.codeState.isPlay,
        isPause: state.codeState.isPause,
    }
};
export const putActionsToProps_Code = (dispatch) => {
    return {
        changeSelectedButton: bindActionCreators(changeSelectedButton, dispatch),
        addPictureInTD: bindActionCreators(addPictureInTD, dispatch),
        removePictureInTD: bindActionCreators(removePictureInTD, dispatch),
        selectRow: bindActionCreators(SelectRow, dispatch),
        saveAlg: bindActionCreators(SaveAlg, dispatch),
        loadAlg: bindActionCreators(LoadAlg, dispatch),
        clear: bindActionCreators(ClearRows, dispatch),
        restart: bindActionCreators(Restart, dispatch),
    }
};

//-----------------------------------------------------------

export const mapReducer = (state = initialState_Map, action) => {
    switch (action.type) {
        case actionsMap.REDUCE_HP: {
            let mapArr = state.map.slice();
            let {i,j} = action.payload;
            let img = mapArr[j][i][0];

            switch (img.tile) {
                case tileNames._3hp:
                    mapArr[j][i][0] = {tile: tileNames._2hp };
                    return {...state, map: mapArr};

                case tileNames._2hp:
                    mapArr[j][i][0] = {tile: tileNames._1hp };
                    return {...state, map: mapArr};

                case tileNames._1hp:
                    mapArr[j][i] = [];
                    return {...state, map: mapArr, targetCount: state.targetCount - 1 };
            }
            return state
        }
        case actionsMap.LOAD_MAP:{
            const text = action.payload === ""? state.initialMap : action.payload;

            let xmlDoc = null;

            try {
                if (window.DOMParser) {
                    // code for modern browsers
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(text,"text/xml");
                }
                else {
                    // code for old IE browsers
                    // eslint-disable-next-line
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(text);
                }

                let targetCount = 0;

                const world = xmlDoc.getElementsByTagName('World')[0];
                const width = Number(world.getAttribute('Width'));
                const height = Number(world.getAttribute('Height'));
                const shellDistance = Number(world.getAttribute('ShellDistance'));

                const tankEl = world.getElementsByTagName('Tank')[0];
                let turretstatus = 0;
                switch (tankEl.getElementsByTagName('TurretStatus')[0].innerHTML) {
                    case "PartiallyLoaded":
                        turretstatus = 1;
                        break;
                    case "Ready":
                        turretstatus = 2;
                        break;
                }


                const tank = {
                    X: Number(tankEl.getAttribute('X')),
                    Y: Number(tankEl.getAttribute('Y')),
                    TankDirection: getAngleByDirection(tankEl.getElementsByTagName('TankDirection')[0].innerHTML),
                    TurretDirection: getAngleByDirection(tankEl.getElementsByTagName('TurretDirection')[0].innerHTML),
                    TurretStatus: turretstatus,
                };
                const units = world.getElementsByTagName('Units')[0].children;

                let map = [];
                for (let i = 0 ; i < height; i++){
                    let row = [];
                    for (let j = 0 ; j < width; j++) {
                        row.push([]);
                    }
                    map.push(row)
                }


                for(let c = 0 ; c < units.length; c++){
                    const X = Number(units[c].getAttribute('X'));
                    const Y = Number(units[c].getAttribute('Y'));
                    let XShift = units[c].getAttribute('XShift');
                    if (XShift)
                        XShift = Number(units[c].getAttribute('XShift'));
                    let YShift = units[c].getAttribute('YShift');
                    if (YShift)
                        YShift = Number(units[c].getAttribute('YShift'));

                    let tile = tileNames.empty;
                    switch (units[c].tagName) {
                        case "Swamp":{
                            tile = (tileNames.swamp);
                            break;
                        }
                        case "Rock":{
                            tile = (tileNames.mountains);
                            break;
                        }
                        case "LittleRock":{
                            tile = (tileNames.littleMountains);
                            break;
                        }
                        case "LittleSwamp":{
                            tile = (tileNames.littleSwamp);
                            break;
                        }
                        case "LittlePillbox":{
                            targetCount+=1;
                            tile = (tileNames._1hp);
                            break;
                        }
                        case "MediumPillbox":{
                            targetCount+=1;
                            tile = (tileNames._2hp);
                            break;
                        }
                        case "BigPillbox":{
                            targetCount+=1;
                            tile = (tileNames._3hp);
                            break;
                        }
                    }
                    map[Y][X].push({ XShift: XShift, YShift: YShift, tile: tile});
                }
                return {...state,
                        shellDistance: shellDistance,
                        tank: tank,
                        mapWidth: width,
                        mapHeight: height,
                        map: map,
                        mapTracers:[],
                        initialMap: text,
                        targetCount: targetCount
                }
            }
            catch (e) {
                alert('Ошибка файл карты неправильно сформирован');
            }
            break;
        }
        case actionsMap.ZOOM:{
            let {tileSize} = state;
            tileSize += action.payload;
            if (tileSize < 20)
                {tileSize = 20;}
            if (tileSize > 80)
                {tileSize = 80;}
            return {...state, tileSize: tileSize};
        }
    }
    return state
};

export const putStateToProps_Map = (state) =>{
    return {
        shellDistance: state.mapState.shellDistance,
        tank: state.mapState.tank,
        mapWidth: state.mapState.mapWidth,
        mapHeight: state.mapState.mapHeight,
        map: state.mapState.map,
        mapTracers: state.mapState.mapTracers,
        tileSize: state.mapState.tileSize,
    }
};
export const putActionsToProps_Map = (dispatch) => {
    return {
        reduceHP: bindActionCreators(reduceHP, dispatch),
        loadMap: bindActionCreators(loadMap, dispatch),
        zoomIn: bindActionCreators(zoomIn, dispatch),
        zoomOut: bindActionCreators(zoomOut, dispatch),
        restart:bindActionCreators(Restart, dispatch),
    }
};

//-----------------------------------------------------------

const getPointByDirection = (className, direction) =>{
    let nextPoint= [0,0];

    const classT = gameButtons[`${className}`];

    switch (getDirectionByAngle(className, direction)) {
        case classT.North:
            nextPoint = [0, -1];
            break;
        case classT.NorthEast:
            nextPoint = [1, -1];
            break;
        case classT.East:
            nextPoint = [1, 0];
            break;
        case classT.SouthEast:
            nextPoint = [1, 1];
            break;
        case classT.South:
            nextPoint = [0, 1];
            break;
        case classT.SouthWest:
            nextPoint = [-1, 1];
            break;
        case classT.West:
            nextPoint = [-1, 0];
            break;
        case classT.NorthWest:
            nextPoint = [-1, -1];
            break;
    }
    return nextPoint;
}

// function getXMLTag(className, tag ) {
//     switch (className) {
//         case "gunner":
//             switch (tag) {
//                 case gameButtons.gunner.North:
//                     return "PauseGunner";
//                 case gameButtons.gunner.NorthEast:
//                     return "TurnTurretClockwise45";
//                 case gameButtons.gunner.East:
//                     return "TurnTurretClockwise90";
//                 case gameButtons.gunner.SouthEast:
//                     return "TurnTurretClockwise135";
//                 case gameButtons.gunner.South:
//                     return "TurnTurretAround";
//                 case gameButtons.gunner.SouthWest:
//                     return "TurnTurretCounterClockwise135";
//                 case gameButtons.gunner.West:
//                     return "TurnTurretCounterClockwise90";
//                 case gameButtons.gunner.NorthWest:
//                     return "TurnTurretCounterClockwise45";
//                 case gameButtons.gunner.Fire:
//                     return "FireCommand";
//                 case gameButtons.gunner.Pause:
//                     return "PauseGunner"
//             }
//             break;
//         case "driver":
//             break;
//         case "charger":
//             break;
//         default:
//     }
//     return ""
// }

export const map_codeReducer = (state = initialState, action) =>{
    switch (action.type) {
        case actionsMap_Code.SELECT_ROW:
        {
            return {...state, codeState:{...state.codeState, selectedRow: action.payload }}
        }
        case actionsMap_Code.ROTATE_TURRET:
        {
            const newAngle = transformAngle(getAngleByDirection(action.payload)
                                + state.mapState.tank.TurretDirection);
            if (state.mapState.tank)
                return {...state, mapState:{...state.mapState,
                        tank: {...state.mapState.tank,
                            TurretDirection: newAngle }}};
            break;
        }
        case actionsMap_Code.ROTATE_TANK:
        {
            const newAngleBody = transformAngle(getAngleByDirection(action.payload)
                                    + state.mapState.tank.TankDirection);
            const newAngleTurret = transformAngle(getAngleByDirection(action.payload)
                                    + state.mapState.tank.TurretDirection);
            if (state.mapState.tank)
                return {...state, mapState:{...state.mapState,
                        tank: {...state.mapState.tank,
                            TankDirection: newAngleBody,
                            TurretDirection: newAngleTurret}}};
            break;
        }
        case actionsMap_Code.MOVE_TANK:
        {
            const {tank} = state.mapState;

            if (tank) {
                let nextPoint = getPointByDirection("driver",tank.TankDirection);

                if (!action.payload) {
                    nextPoint[0] = nextPoint[0] * -1;
                    nextPoint[1] = nextPoint[1] * -1;
                }


                return {
                    ...state, mapState: {
                        ...state.mapState,
                        tank: {
                            ...state.mapState.tank,
                            X: tank.X + nextPoint[0], Y: tank.Y + nextPoint[1]
                        }
                    }
                };
            }
            break;
        }
        case actionsMap_Code.MOVE_TANK_ROTATE_AND_FORWARD:
        {
            const {tank} = state.mapState;

            if (tank) {

                const newAngleBody = transformAngle( tank.TankDirection + (action.payload? -45 : 45 ));
                const newAngleTurret = transformAngle( tank.TurretDirection + (action.payload? -45 : 45 ));

                let nextPoint = getPointByDirection("driver",newAngleBody);

                return {
                    ...state, mapState: {
                        ...state.mapState,
                        tank: {
                            ...state.mapState.tank,
                            X: tank.X + nextPoint[0], Y: tank.Y +  nextPoint[1],
                            TankDirection: newAngleBody, TurretDirection: newAngleTurret
                        }
                    }
                };
            }
            break;
        }
        case actionsMap_Code.LOAD:
        {
            if (state.mapState.tank) {
                let status = state.mapState.tank.TurretStatus + 1;
                if (status === 3){
                    status = 0;
                }
                return {
                    ...state, mapState: {
                        ...state.mapState,
                        tank: {
                            ...state.mapState.tank,
                            TurretStatus: status
                        }
                    }
                };
            }
            break;
        }
        case actionsMap_Code.START:
        {
            const mapState = !state.codeState.isPause
                ?  mapReducer(state.mapState,
                {type: actionsMap.LOAD_MAP, payload:""})
                :{} ;

            return {
                ...state, codeState: {
                    ...state.codeState,
                    isPlay: true,
                    currentRow: state.codeState.isPause? state.codeState.currentRow: 0,
                     isPause: false
                }, mapState: { ...state.mapState,
                    ...mapState}
            };
        }
        case actionsMap_Code.STOP:
        {
            if(state.mapState.targetCount <= 0)
                alert(`Все цели уничтожены. Поздравляю!!\nБыло задействовано ${state.codeState.rows.length-1} строк`);
            else
                alert('Не все цели уничтожены :((');

            return {
                ...state, codeState: {
                    ...state.codeState, isPlay: false, isPause: false
                }
            };
        }
        case actionsMap_Code.PAUSE:
        {
            return {
                ...state, codeState: {
                    ...state.codeState, isPlay: false, isPause: true
                }
            };
        }
        case actionsMap_Code.RESTART:
        {
            return {
                ...state,
                mapState: {
                    ...state.mapState, ...mapReducer(
                        state.mapState,
                        {type: actionsMap.LOAD_MAP, payload:""}
                    )
                },
                codeState: {
                    ...state.codeState, isPlay: false, isPause: false, currentRow:0, selectedRow:0,
                }
            };
        }
        case actionsMap_Code.NEXT_MOVE:
        {
            // if (state.codeState.isPlay) {
                const index = state.codeState.currentRow + 1;
                return {
                    ...state, codeState: {
                        ...state.codeState, currentRow: index
                    }
                };
            // }
            break;
        }
        case actionsMap_Code.FIRE:
        {
            if (state.mapState.tank) {
                console.log(`FIRE from ${state.mapState.tank.X}-${state.mapState.tank.Y}`);

                const {map, tank, shellDistance, mapTracers} = state.mapState;
                const {X, Y} = tank;

                let newX = X;
                let newY = Y;

                const point = getPointByDirection("gunner", tank.TurretDirection);

                for (let i= 0;  i < shellDistance; i++){
                    newX += point[0];
                    newY += point[1];

                    if (newX >= state.mapState.mapWidth
                        || newX < 0
                        || newY >= state.mapState.mapHeight
                        || newY < 0)
                        break;

                    if (map[newY][newX].length > 0 ){
                        switch (map[newY][newX][0].tile) {
                            case tileNames.mountains:
                                return {...state, mapState:{...state.mapState,
                                        mapTracers: mapTracers,
                                        tank: {...state.mapState.tank, TurretStatus: 0}}};

                            case tileNames._3hp:
                            case tileNames._2hp:
                            case tileNames._1hp:
                                mapTracers.push(
                                    {
                                        tag: point[0] * point[1] === 0? tileNames.trailVert: tileNames.trailDiag,
                                        X: newX,
                                        Y: newY,
                                        inverted: point[1] === 0 || point[0] * point[1] > 0,
                                    }
                                );
                                return {...state, mapState:{...state.mapState,
                                        ...mapReducer(state.mapState,reduceHP(newX, newY)),
                                        mapTracers: mapTracers,
                                        tank: {...state.mapState.tank, TurretStatus: 0}}};

                            case tileNames.swamp:
                            case tileNames.empty:
                                if (map[newY][newX].length === 1)
                                    mapTracers.push(
                                        {
                                            tag: point[0] * point[1] === 0? tileNames.trailVert: tileNames.trailDiag,
                                            X: newX,
                                            Y: newY,
                                            inverted: point[1] === 0 || point[0] * point[1] > 0,
                                        }
                                    );
                                continue;
                        }

                        let offsetX = point[0] * -1;
                        let offsetY = point[1] * -1;
                        let j;
                        for (j =0; j < 3; j++ ){
                            let k = 0;
                            for (k=0; k < map[newY][newX].length; k++ ){
                                const obj = map[newY][newX][k];
                                if (offsetX === obj.XShift
                                    && offsetY === obj.YShift
                                    && obj.tile === tileNames.littleMountains){
                                    break;
                                }
                            }
                            if (k !== map[newY][newX].length){
                                break;
                            }

                            mapTracers.push(
                                {
                                    tag: point[0] * point[1] === 0? tileNames.littleTrailVert
                                                                    : tileNames.littleTrailDiag,
                                    X: newX,
                                    Y: newY,
                                    XShift: offsetX,
                                    YShift: offsetY,
                                    inverted: point[1] === 0 || point[0] * point[1] > 0,
                                }
                            );
                            offsetX += point[0];
                            offsetY += point[1];
                        }
                        if (j < 3)
                            return {
                                ...state, mapState: {
                                    ...state.mapState, tank: {
                                        ...state.mapState.tank,
                                        TurretStatus: 0
                                    },
                                    mapTracers: mapTracers
                                }
                            };

                        for (;j > 0; j--){
                            mapTracers.pop()
                        }
                    }

                    mapTracers.push(
                        {
                            tag: point[0] * point[1] === 0? tileNames.trailVert: tileNames.trailDiag,
                            X: newX,
                            Y: newY,
                            inverted: point[1] === 0 || point[0] * point[1] > 0,
                        }
                    );
                }

                return {
                    ...state, mapState: {
                        ...state.mapState, tank: {
                            ...state.mapState.tank,
                            TurretStatus: 0
                        },
                        mapTracers: mapTracers
                    }
                };
            }
            break;
        }
        case actionsMap_Code.SAVE_ALG:{
            const filename = "Program.tankcrewprogram";
            const xmlDoc = document.implementation.createDocument("", "", null );

            const program = xmlDoc.createElement("Program");

            const rows = state.codeState.rows;
            for (let i = 0; i < rows.length-1; i++){
                const command = xmlDoc.createElement("Command");
                let elName = rows[i].gunner !== null
                    ? rows[i].gunner.tag
                    : gameButtons.gunner.Pause;
                command.appendChild(xmlDoc.createElement(elName));

                elName = rows[i].driver !== null
                    ? rows[i].driver.tag
                    : gameButtons.driver.Pause;
                command.appendChild(xmlDoc.createElement(elName));

                elName = rows[i].charger !== null
                    ? "LoadTurret_" + rows[i].charger.tag
                    : gameButtons.charger.Pause;
                command.appendChild(xmlDoc.createElement(elName));

                program.appendChild(command);
            }

            xmlDoc.appendChild(program);

            const data = `<?xml version="1.0" encoding="utf-8"?>` + ( new XMLSerializer().serializeToString(xmlDoc));

            const file = new Blob([data], {type: 'text/plain'});
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            else { // Others
                const a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);

                a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');

                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
            return state;
        }
        case actionsMap_Code.LOAD_ALG:{
            let text = action.payload;

            // const text = action.payload === ""? state.initialMap : action.payload;

            let xmlDoc = null;

            try {
                if (window.DOMParser) {
                    // code for modern browsers
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(text,"text/xml");
                }
                else {
                    // code for old IE browsers
                    // eslint-disable-next-line
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(text);
                }

                const program = xmlDoc.getElementsByTagName('Program')[0];
                const commands = program.getElementsByTagName("Command");

                let rows = [];

                for(let i = 0 ; i < commands.length; i++){

                    const row = {gunner: null, driver: null, charger: null};

                    const gunner = commands[i].children[0];
                    const driver = commands[i].children[1];
                    const charger = commands[i].children[2];

                    row.gunner  = getGameButtonImage("gunner", gunner.nodeName);
                    row.driver  = getGameButtonImage("driver", driver.nodeName);
                    row.charger  = getGameButtonImage("charger", charger.nodeName);

                    rows.push(row);
                }
                while (rows.length > 0
                    && rows[rows.length-1].gunner.tag === gameButtons.gunner.Pause
                    && rows[rows.length-1].driver.tag === gameButtons.driver.Pause
                    && rows[rows.length-1].charger.tag === gameButtons.charger.Pause )
                {
                    rows.pop();
                }

                rows.push({gunner: null, driver: null, charger: null});

                return {...state, codeState: {...state.codeState, rows: rows}}
            }
            catch (e) {
                alert('Ошибка файл алгоритма неправильно сформирован');
            }
            break;
        }
        case actionsMap_Code.CHANGE_SPEED:{

            let speed = state.codeState.speed;

            speed += 100 * (action.payload? -1 : 1);

            if (speed > 500)
                speed = 500;

            if (speed < 100)
                speed = 100;

            return {
                ...state, codeState: {
                    ...state.codeState, speed: speed
                }
            }
        }
    }
    return state
};

export const putStateToProps_AlgButtons = (state) =>{

    return {
        selectedRow: state.codeState.selectedRow,
        currentRow: state.codeState.currentRow,
        rows: state.codeState.rows,
        shellDistance: state.mapState.shellDistance,
        tank: state.mapState.tank,
        mapWidth: state.mapState.width,
        mapHeight: state.mapState.height,
        map: state.mapState.map,
        isPlay: state.codeState.isPlay,
        isPause: state.codeState.isPause,
        speed: state.codeState.speed
    }
};
export const putActionsToProps_AlgButtons = (dispatch) => {
    return {
        rotateTurret: bindActionCreators(RotateTurret, dispatch),
        rotateTank: bindActionCreators(RotateTank, dispatch),
        moveTankForward: bindActionCreators(MoveTankForward, dispatch),
        moveTankBackward: bindActionCreators(MoveTankBackward, dispatch),
        moveTankRotateLeftAndForward: bindActionCreators(MoveTankRotateLeftAndForward, dispatch),
        moveTankRotateRightAndForward: bindActionCreators(MoveTankRotateRightAndForward, dispatch),
        load: bindActionCreators(Load, dispatch),
        selectRow: bindActionCreators(SelectRow, dispatch),
        start: bindActionCreators(Start, dispatch),
        stop: bindActionCreators(Stop, dispatch),
        pause: bindActionCreators(Pause, dispatch),
        nextMove: bindActionCreators(NextMove, dispatch),
        restart: bindActionCreators(Restart, dispatch),
        fire: bindActionCreators(Fire, dispatch),
        increaseSpeed: bindActionCreators(IncreaseSpeed, dispatch),
        decreaseSpeed: bindActionCreators(DecreaseSpeed, dispatch),
    }
};

export const putStateToProps_TankInfo = (state) =>{

    return {
        tank: state.mapState.tank,
    }
};
