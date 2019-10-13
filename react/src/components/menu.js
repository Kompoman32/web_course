import React, {Component} from "react";
import ReactModal from "react-modal";
import {connect, Provider} from "react-redux";
import {store} from '../store/stores.js'
import {gunnerBtnsCount, driverBtnsCount, chargerBtnsCount, gameButtons} from '../store/stores.js'
import {putActionsToProps_Code, putStateToProps_Code} from "../store/reducers.js";
import {putStateToProps_AlgButtons, putActionsToProps_AlgButtons, putStateToProps_TankInfo} from "../store/reducers.js";
import {getmapTile,getGameButtonImage, getMenuButtons, tileNames} from "../store/stores";
import Info from "../components/info"

const error = {
    cannotChangeDirection: 'Невозможно изменить направление во время движения, необходимо остановить танк (сделать паузу)',
    outOfBounds: 'Танк выехал за границу',
    moveOnMountain: 'Танк не может проехать по горам',
    moveOnSwamp: 'Танк не может проехать по лесам',
    moveOnTarget: 'Танк не может проехать по мишеням',
    moveOnSmth: 'Танк не может проехать по этой клетке',
    cannotPartiallyLoad: 'Команду "Заряжай 1" можно выполнить только если орудие не заряжено',
    cannotFullyLoad: 'Команду "Заряжай 2" можно выполнить только если уже выполнена команда "Заряжай 1"',
    cannotFire: 'Нельзя выстрелить, пока орудие не полностью заряжено',
};

class Menu extends Component {
    render() {
        return (
            <div id="menuDiv" className="flex-row flex-align-start" >
                <div  className="margin-10">
                    <Provider store={store}>
                        <WrappedGameTable />
                    </Provider>
                </div>
                <div  className="flex-column flex-align-start">
                    <Provider store={store}>
                        <WrappedMenuButtons />
                    </Provider>
                    <Provider store={store}>
                        <WrappedGameButtonsTable />
                    </Provider>
                </div>
            </div>
        )
    }
}

class MenuButtons extends Component {
    handlePlay(){
        if (!this.props.isPlay) {
            this.props.start();
            setTimeout(() => this.playNext(), this.props.speed)
        }
    }
    handleStop(){
        this.props.restart();
    }
    handlePause(){
        if (this.props.isPlay)
            this.props.pause();
    }
    handleNextStep(){
        if (this.props.isPlay) {
            this.props.pause();
        }
        else {
            this.props.start();
        }

        setTimeout(() => {
            if (this.nextMove(this.props.currentRow)) {
                this.props.nextMove();
                this.props.pause();
            }
            else {
                this.props.stop();
            }
        }, this.props.speed)
    }
    handleUntilRow(){
        if (!this.props.isPlay) {
            this.props.start();
            setTimeout( ()=> {
                this.playUntilRow();
                }, 0
            )
        }
    }
    playUntilRow(){
        if (this.props.isPlay) {
            console.log(`1 ${this.props.isPlay} ${this.props.isPause}`)

            setTimeout(() => {
                if (this.props.currentRow < this.props.selectedRow) {
                    if (this.props.isPlay && this.nextMove(this.props.currentRow)) {
                        this.props.nextMove();
                        this.playUntilRow();

                        console.log(`2 ${this.props.isPlay} ${this.props.isPause}`)
                    }
                }
                else {
                    this.props.pause();
                }
            }, this.props.speed)
        }
        else{
            // console.log(`3 ${this.props.isPlay} ${this.props.isPause}`)
            // if (!this.props.isPause)
            //     console.log(`4 ${this.props.isPlay} ${this.props.isPause}`)
            //     setTimeout(() => {
            //         this.props.pause();
            //     }, this.props.speed)
        }

    }

    playNext(){
        if (this.props.isPlay) {
            if (this.nextMove(this.props.currentRow)) {
                this.props.nextMove();
                setTimeout(()=> {
                    if (this.props.isPlay && !this.props.isPause)
                        this.playNext();
                },this.props.speed);
            } else
                {
                    this.props.stop();}
        }
        else {
            this.props.stop();
        }
    }
    nextMove(indexRow){
        // const state = store.getState();
        const {tank, map, mapWidth, mapHeight} = this.props;//state.mapState;
        const {rows} = this.props;//state.codeState;
        const currRowIndex = indexRow;

        if (currRowIndex >= rows.length - 1)
            return false;

        const currRow = rows[currRowIndex];
        const {gunner, driver,  charger} = currRow;

        if (gunner !== null){
            const tag = gunner.tag;
            switch (tag) {
                case gameButtons.gunner.North:
                case gameButtons.gunner.NorthEast:
                case gameButtons.gunner.East:
                case gameButtons.gunner.SouthEast:
                case gameButtons.gunner.South:
                case gameButtons.gunner.SouthWest:
                case gameButtons.gunner.West:
                case gameButtons.gunner.NorthWest:{
                    this.props.rotateTurret(tag);
                    break;
                }
                case gameButtons.gunner.Fire:{
                    /*TODO кнопка стрельбы*/
                    if (tank.TurretStatus !== 2)
                    {
                        alert(error.cannotFire + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }
                    this.props.fire();
                    break;
                }
                default:
                    break;
            }
        }

        if (driver !== null){
            const tag = driver.tag;
            switch (tag) {
                case gameButtons.driver.North:
                case gameButtons.driver.NorthEast:
                case gameButtons.driver.East:
                case gameButtons.driver.SouthEast:
                case gameButtons.driver.South:
                case gameButtons.driver.SouthWest:
                case gameButtons.driver.West:
                case gameButtons.driver.NorthWest:{
                    this.props.rotateTank(tag);
                    break;
                }

                case gameButtons.driver.MoveForward:
                case gameButtons.driver.MoveBackward:{
                    if (currRowIndex > 0
                        && rows[currRowIndex - 1].driver !== null
                        && (
                        (tag === gameButtons.driver.MoveForward
                            && rows[currRowIndex -1].driver.tag === gameButtons.driver.MoveBackward)
                            ||
                        (tag === gameButtons.driver.MoveBackward
                            && rows[currRowIndex -1].driver.tag === gameButtons.driver.MoveForward)
                            )){
                        alert(error.cannotChangeDirection + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }

                    if (tag === gameButtons.driver.MoveForward)
                        this.props.moveTankForward();
                    else this.props.moveTankBackward();

                    const {X,Y} = this.props.tank;

                    if (X < 0 || X >= mapWidth
                        || Y < 0 || Y >= mapHeight)
                    {
                        alert(error.outOfBounds + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }

                    if (map[Y][X].length > 0){
                        let msg = error.moveOnSmth;
                        switch (map[Y][X][0].tile) {
                            case tileNames.swamp:
                                msg = error.moveOnSwamp;
                                break;
                            case tileNames.mountains:
                                msg = error.moveOnMountain;
                                break;
                            case tileNames._3hp:
                            case tileNames._2hp:
                            case tileNames._1hp:
                                msg = error.moveOnTarget;
                                break;
                        }
                        alert(msg + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }

                    break;
                }

                case gameButtons.driver.TurnLeftAndMoveForward:
                case gameButtons.driver.TurnRightAndMoveForward:
                {
                    if (currRowIndex > 0
                        && rows[currRowIndex - 1].driver !== null
                        && rows[currRowIndex -1].driver.tag === gameButtons.driver.MoveBackward)
                    {
                        alert(error.cannotChangeDirection + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }

                    if (tag === gameButtons.driver.TurnLeftAndMoveForward)
                        this.props.moveTankRotateLeftAndForward();
                    else this.props.moveTankRotateRightAndForward();

                    const {X,Y} = this.props.tank;

                    if (X < 0 || X >= mapWidth
                        || Y < 0 || Y >= mapHeight)
                    {
                        alert(error.outOfBounds + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }

                    if (map[Y][X].length > 0){
                        let msg = error.moveOnSmth;
                        switch (map[Y][X][0].tile) {
                            case tileNames.swamp:
                                msg = error.moveOnSwamp;
                                break;
                            case tileNames.mountains:
                                msg = error.moveOnMountain;
                                break;
                            case tileNames._3hp:
                            case tileNames._2hp:
                            case tileNames._1hp:
                                msg = error.moveOnTarget;
                                break;
                        }
                        alert(msg + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }
                    break;
                }
            }
        }

        if (charger !== null){
            switch (charger.tag) {
                case gameButtons.charger.PartiallyLoaded: {
                    if (tank.TurretStatus === 1 || (tank.TurretStatus === 2
                        && (gunner === null || gunner.tag !== gameButtons.gunner.Fire)))
                    {
                        alert(error.cannotPartiallyLoad + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }
                    break;
                }
                case gameButtons.charger.Ready:{
                    if (tank.TurretStatus >= 2){
                        alert(error.cannotFullyLoad + `\nОшибка в строке (${indexRow + 1})`);
                        return false;
                    }
                    break;
                }
                default:
                    return true
            }
            this.props.load();
        }
        return true;
    }

    render() {
        return (
            <div className="flex-row ">
                <div className="flex-column flex-justify-evenly margin-10">
                    <InfoButton />
                    <Provider store={store}>
                        <WrappedTankInfo />
                    </Provider>
                </div>
                <div className="flex-column flex-justify-center widthAll">
                    <div className="flex-column">
                        <SpeedRange
                            onIncreaseClick={() => this.props.increaseSpeed()}
                            onDecreaseClick={() => this.props.decreaseSpeed()}
                            speed = {this.props.speed}
                        />
                        <div style={{display:"none"}}>{this.props.isPlay + ``}</div>
                        <div style={{display:"none"}}>{this.props.isPause + ``}</div>
                    </div>
                    <div id="moveBtnDiv" className="flex-row">
                        <div className="flex-row flex-justify-center">
                            <div className="flex-row flex-wrap">
                                <div className="flex-row">
                                    <MenuButton image={getMenuButtons(0)} onClick={() => this.handlePlay()} />
                                    <MenuButton image={getMenuButtons(1)} onClick={() => this.handlePause()} />
                                    <MenuButton image={getMenuButtons(2)} onClick={() =>this.handleStop()} />
                                </div>
                                <div className="flex-row">
                                    <MenuButton image={getMenuButtons(3)} onClick={() =>this.handleUntilRow()} />
                                    <MenuButton image={getMenuButtons(4)} onClick={() =>this.handleNextStep()} />
                                </div>
                            </div>
                        </div>
                        <div style={{width: 50}}> </div>
                    </div>
                    <div style={{textAlign: 'right'}} >
                        <span>Дальность стрельбы: </span>
                        <span>{this.props.shellDistance}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export function MenuButton(props) {
    return (
        <button className="margin-5" onClick={()=> props.onClick()} style={props.image} />
    )
}

const WrappedMenuButtons = connect(putStateToProps_AlgButtons, putActionsToProps_AlgButtons)(MenuButtons);

// =============================================

class InfoButton extends Component {
    constructor(props){
        super(props);
        this.state={
            isOpen: false
        }
    }

    handleClick(){
        this.setState({isOpen: false});
    }

    render() {
        return (
            <div>
                <button id="infoButton" className="flex-row" onClick={() => this.setState({isOpen: true})}>
                    <span>INFO</span>
                    <div style={getMenuButtons(10)} />
                </button>
                <ReactModal isOpen={this.state.isOpen} onRequestClose={() => this.handleClick()} >
                    <Info onClick={() => this.handleClick()} />
                </ReactModal>
            </div>
        );
    }
}


class TankInfo extends Component {

    loadTank(){
        const {tank} = this.props;
        if (!tank) return null;
        const valueBody = {...getmapTile(tileNames.tankBody, 100),position: "absolute",
            zIndex:9998,
            left: 0,
            top: 0,
            transform: `rotate(${tank.TankDirection}deg)`,
        };
        const valueHead = {...getmapTile(tileNames.tankHead, 100),position: "absolute",
            zIndex:9999,
            left: 0,
            top: 0,
            transform: `rotate(${tank.TurretDirection}deg)`,
        };
        const status = this.props.tank.TurretStatus === 0
            ? tileNames.tankStatus_NotLoaded
            : this.props.tank.TurretStatus === 1
                ? tileNames.tankStatus_PartLoaded
                : tileNames.tankStatus_Loaded;

        const valueStatus = {...getmapTile(status, 100),position: "absolute",
            zIndex:9999,
            left: 0,
            top: 0,
        };
        return (
            [
                <div style={valueBody}></div>,
                <div style={valueHead}></div>,
                <div style={valueStatus}></div>,
            ])
    }

    render()
    {
        return (
            <div id="tankDiv" style={{position: "relative", height:100, width:100}}>
                {this.loadTank()}
            </div>
        )
    }
}

const WrappedTankInfo = connect(putStateToProps_TankInfo)(TankInfo);

function SpeedRange(props){
    return (
        <div className="flex-column">
            <div>Скорость воспроизведения</div>
            <div className = "flex-row">
                <MenuButton image={getMenuButtons(8)} onClick={()=>props.onIncreaseClick()} />
                <MenuButton image={getMenuButtons(9)} onClick={()=>props.onDecreaseClick()} />
                <span style={{width:50}} >{600 - props.speed}</span>
            </div>
        </div>
    )
}

// ========================================

class GameTable extends Component{
    renderRows(){
        let arr=[];
        const {rows} = this.props;
        for(let i = 0; i < rows.length; i++){
            arr.push(
                <GameTableRow
                    selected ={this.props.selectedRow === i}
                    current = {this.props.currentRow === i}
                    index={i}
                    value={rows[i]}
                    OnRowClick={(o)=> {
                        if (!this.props.isPlay)
                            this.props.selectRow(o)}}
                    onClickTD_LMB={(className) => {
                        if (!this.props.isPlay && !this.props.isPause){
                            this.props.addPictureInTD(className, i)}}}
                    onClickTD_RMB={(className) => {
                        if (!this.props.isPlay && !this.props.isPause)
                            this.props.removePictureInTD(className, i)}}
                />
            )
        }

        return arr;
    }

    handleSaveAlg(){
        if (this.props.rows[0].gunner !== null
            || this.props.rows[0].driver !== null
            || this.props.rows[0].charger !== null
            || this.props.rows.length > 1)
        {
            this.props.saveAlg();
        }
    }
    handleClear(){
        if (!this.props.isPlay && !this.props.isPlay)
            this.props.clear();
    }

    fileLoad(evt){
        var files = evt.target.files; // FileList object
        var reader = new FileReader();
        const {loadAlg} = this.props;
        reader.onload = (e) => {
            loadAlg(e.target.result);
            this.props.restart();
            //console.log(typeof e.target.result)
        };
        reader.readAsText(files[0].slice());
    }

    render() {
        return (
            <div>
                <div className="flex-row flex-justify-between">
                    <div className="flex-row">
                        <MenuButton image={getMenuButtons(5)}
                                    onClick={() =>this.handleSaveAlg()}
                        />
                        <label id="labelFor_uploadAlg" htmlFor="uploadAlg">
                            <div style={getMenuButtons(6)} />
                        </label>
                        <input id="uploadAlg" type="file" onChange={(e)=> this.fileLoad(e)}/>
                    </div>
                    <MenuButton image={getMenuButtons(7)}
                                onClick={() =>this.handleClear()}
                    />
                </div>
                <div id="commandsDiv" className="overflow overflow-y-visible">
                    <table id="commands">
                        <tbody>
                        <tr>
                            <th>#</th>
                            <th>Наводчик</th>
                            <th>Водитель</th>
                            <th>Заряжающий</th>
                        </tr>
                        {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const WrappedGameTable = connect(putStateToProps_Code, putActionsToProps_Code)(GameTable);

class GameTableRow extends Component{
    render() {
        return (
            <tr className={(this.props.selected ? "selectedRow": "") + (this.props.current ? " currentRow": "") }
                onClick={()=>this.props.OnRowClick(this.props.index)}>
                <td style={{width: 20}} >{this.props.index+1}</td>
                <GameTableCell
                    value={this.props.value.gunner}
                    onClickTD_LMB={() => this.props.onClickTD_LMB("gunner")}
                    onClickTD_RMB={() => this.props.onClickTD_RMB("gunner")}
                />
                <GameTableCell
                    value={this.props.value.driver}
                    onClickTD_LMB={() => this.props.onClickTD_LMB("driver")}
                    onClickTD_RMB={() => this.props.onClickTD_RMB("driver")}
                />
                <GameTableCell
                    value={this.props.value.charger}
                    onClickTD_LMB={() => this.props.onClickTD_LMB("charger")}
                    onClickTD_RMB={() => this.props.onClickTD_RMB("charger")}
                />
            </tr>
        );
    }
}

function GameTableCell(props) {
    return (
        <td className="gameTD" onClick={() => props.onClickTD_LMB()} onContextMenu={(e) => {e.preventDefault(); props.onClickTD_RMB()} }>
            <div className="flex-column flex-justify-center">
                <div style={props.value} />
            </div>
        </td>
    );
}

// ========================================

class GameButtonsTable extends Component{
    renderButtons(className) {
        let arr = [];
        const {gunnerSelectedIndex,driverSelectedIndex,chargerSelectedIndex,
                changeSelectedButton} = this.props;
        switch (className) {
            case "gunner": {
                for (let i = 0; i < gunnerBtnsCount; i++) {
                    arr.push(
                        <GameButton key={`${className} - ${i}`}
                                    index={i} class={className} selected={gunnerSelectedIndex === i}
                                    onClick={() => changeSelectedButton(i, className)}/>
                    );
                }
                break;
            }
            case "driver":{
                for (let i = 0; i < driverBtnsCount; i++) {
                    arr.push(
                        <GameButton key={`${className} - ${i}`}
                                    index={i} class={className} selected={driverSelectedIndex === i}
                                    onClick={() => changeSelectedButton(i, className)}/>
                    );
                }
                break;
            }
            case "charger":{
                for (let i = 0; i < chargerBtnsCount; i++) {
                    arr.push(
                        <GameButton key={`${className} - ${i}`}
                                    index={i} class={className} selected={chargerSelectedIndex === i}
                                    onClick={() => changeSelectedButton(i, className)}/>
                    );
                }
                break;
            }
            default:
        }
        return arr;
    }

    render() {
        return (
            <div className="flex-row flex-align-start overflow">
                <div className="flex-column">
                    <div style={{height: 20}} className="padding-5">Наводчик</div>
                    <div className="gameButtonsColumn flex-row flex-wrap">
                        {this.renderButtons("gunner")}
                    </div>
                </div>
                <div className="flex-column">
                    <div style={{height: 20}} className="padding-5">Водитель</div>
                    <div className="gameButtonsColumn flex-row flex-wrap">
                        {this.renderButtons("driver")}
                    </div>
                </div>
                <div className="flex-column">
                    <div style={{height: 20, }} className="padding-5">Заряжающий</div>
                    <div className="gameButtonsColumn flex-row flex-wrap">
                        {this.renderButtons("charger")}
                    </div>
                </div>
                <div className="flex-column">

                </div>
            </div>
        )
    }
}

const WrappedGameButtonsTable = connect(putStateToProps_Code, putActionsToProps_Code)(GameButtonsTable);

function GameButton(props) {
    return (
        <button className={props.class + (props.selected? " selected":"") + " margin-1"}
                style={getGameButtonImage(props.class, props.index)}
                onClick={props.onClick}/>
    )
}

export default Menu
