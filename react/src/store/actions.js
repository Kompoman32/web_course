import {initialState_Map, tileNames} from './stores'
import {getAngleByDirection} from './stores'

export const actionsCode={
    CHANGE_SELECTED_BUTTON: "CHANGE_SELECTED_BUTTON",
    ADD_PICTURE_IN_TD: "ADD_PICTURE_IN_TD",
    REMOVE_PICTURE_IN_TD: "REMOVE_PICTURE_IN_TD",
    CLEAR: "CLEAR",
};
export const actionsMap={
    REDUCE_HP: "REDUCE_HP",
    LOAD_MAP: "LOAD_MAP",
    ZOOM: "ZOOM",
};
export const actionsMap_Code={
    SELECT_ROW: "SELECT_ROW",
    ROTATE_TANK: "ROTATE_TANK",
    ROTATE_TURRET: "ROTATE_TURRET",
    MOVE_TANK: "MOVE_TANK",
    MOVE_TANK_ROTATE_AND_FORWARD: "MOVE_TANK_ROTATE_AND_FORWARD",
    LOAD: "LOAD",
    START: "START",
    STOP: "STOP",
    PAUSE: "PAUSE",
    RESTART: "RESTART",
    NEXT_MOVE: "NEXT_MOVE",
    FIRE: "FIRE",
    SAVE_ALG: "SAVE_ALG",
    LOAD_ALG: "LOAD_ALG",
    CHANGE_SPEED: "CHANGE_SPEED",
};
export const actionsTypes ={
    MAP: actionsMap,
    CODE: actionsCode,
    MAP_CODE: actionsMap_Code
};


//----------------------------------------------

export const changeSelectedButton = (index, className) =>{
    return{
        type: actionsCode.CHANGE_SELECTED_BUTTON,
        payload: {
            index: index,
            className: className
        }
    }
};
export const addPictureInTD = (className , indexRow) => {
    return{
        type: actionsCode.ADD_PICTURE_IN_TD,
        payload: {
            className: className,
            indexRow: indexRow
        }
    };
};
export const removePictureInTD = (className , indexRow) => {
    return{
        type: actionsCode.REMOVE_PICTURE_IN_TD,
        payload: {
            className: className,
            indexRow: indexRow
        }
    };
};
export const SelectRow = (index) => {
    return{
        type: actionsMap_Code.SELECT_ROW,
        payload: index
    };
};

//-------------------------------------------------

export const reduceHP = (i, j) => {
    return {
        type: actionsMap.REDUCE_HP,
        payload: {
            i:i,
            j:j
        }
    }
};
export const loadMap = (text) => {
    return {
        type: actionsMap.LOAD_MAP,
        payload: text
    }
};
export const zoomIn = () =>{
    return {
        type: actionsMap.ZOOM,
        payload: 10
    }
};
export const zoomOut = () =>{
    return {
        type: actionsMap.ZOOM,
        payload: -10
    }
};

//----------------------------------------------

export const RotateTank = (direction) => {
    return {
        type: actionsMap_Code.ROTATE_TANK,
        payload: direction
    }
};
export const RotateTurret = (direction) => {
    return {
        type: actionsMap_Code.ROTATE_TURRET,
        payload: direction
    }
};
export const MoveTankForward = () => {
    return {
        type: actionsMap_Code.MOVE_TANK,
        payload: true
    }
};
export const MoveTankBackward = () => {
    return {
        type: actionsMap_Code.MOVE_TANK,
        payload: false
    }
};
export const MoveTankRotateLeftAndForward = () => {
    return {
        type: actionsMap_Code.MOVE_TANK_ROTATE_AND_FORWARD,
        payload: true
    }
};
export const MoveTankRotateRightAndForward = () => {
    return {
        type: actionsMap_Code.MOVE_TANK_ROTATE_AND_FORWARD,
        payload: false
    }
};
export const Load = () => {
    return {
        type: actionsMap_Code.LOAD,
    }
};
export const Start = () => {
    return {
        type: actionsMap_Code.START,
    }
};
export const NextMove = () => {
    return {
        type: actionsMap_Code.NEXT_MOVE,
    }
};
export const Stop = () => {
    return {
        type: actionsMap_Code.STOP,
    }
};
export const Pause = () => {
    return {
        type: actionsMap_Code.PAUSE,
    }
};
export const Restart = () => {
    return {
        type: actionsMap_Code.RESTART,
        payload: ""
    }
};
export const Fire = () => {
    return {
        type: actionsMap_Code.FIRE,
    }
};
export const SaveAlg = () => {
    return {
        type: actionsMap_Code.SAVE_ALG,
    }
};
export const LoadAlg = (text) => {
    return {
        type: actionsMap_Code.LOAD_ALG,
        payload: text,
    }
};
export const IncreaseSpeed = () => {
    return {
        type: actionsMap_Code.CHANGE_SPEED,
        payload: true
    }
};
export const DecreaseSpeed = () => {
    return {
        type: actionsMap_Code.CHANGE_SPEED,
        payload: false
    }
};
export const ClearRows = () => {
    return {
        type: actionsCode.CLEAR,
    }
};

