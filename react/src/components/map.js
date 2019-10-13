import React, {Component} from "react";
import { connect, Provider } from 'react-redux'
import {store} from '../store/stores.js'
import ReactModal from "react-modal";
import {putStateToProps_Map, putActionsToProps_Map} from '../store/reducers.js'
import '../styles/game.css';
import {tileNames, getmapTile, getMenuButtons} from "../store/stores";
import {MenuButton} from "../components/menu.js";


class Map extends Component {
    render() {
        return (
            <div id="mapDiv">
                <Provider store={store}>
                    <WrappedMapTable />
                </Provider>
            </div>
        )
    }
}

class MapTable extends Component {
    constructor(props){
        super(props);

        this.state={sonic:false};

        props.loadMap("")
    }


    renderTable(){
        const tileSize = this.props.tileSize;
        const {map, mapWidth, mapHeight, reduceHP} = this.props;
        const elements = [];

        for (let i = 0; i < mapHeight; i++){
            const row =[];

            for (let j = 0; j < mapWidth; j++){
                if (map[i][j].length > 0
                    && (map[i][j][0].tile === tileNames.littleMountains
                    || map[i][j][0].tile === tileNames.littleSwamp)
                    &&(map[i][j][0].XShift !== null && map[i][j][0].YShift !== null)){
                    let combinedTile =[[null, null, null],[null, null, null],[null, null, null]];
                    for (let k = 0; k < map[i][j].length; k++){

                        combinedTile[map[i][j][k].YShift + 1][map[i][j][k].XShift + 1] =
                            (<MapTile key={`tile ${i} - ${j}: ${map[i][j][k].YShift + 1} - ${map[i][j][k].XShift + 1}`}
                                      value={getmapTile(map[i][j][k].tile, this.props.tileSize, true)} />)
                    }
                    for (let k = 0; k < 9; k++){
                        if (!combinedTile[Math.floor(k / 3)][k %3]){
                            combinedTile[Math.floor(k / 3)][k % 3]
                                = (<MapTile key={`tile ${i} - ${j}: ${Math.floor(k / 3)} - ${k %3}`}
                                            value={getmapTile(tileNames.empty,this.props.tileSize, true)} />);
                        }
                    }
                    const combinedDiv=[];
                    for (let k = 0; k < 3; k++){
                        const combinedRow = [];
                        for (let t = 0; t < 3; t++){
                            combinedRow.push(combinedTile[k][t])
                        }
                        combinedDiv.push(
                            <div className="flex-row">
                                {combinedRow}
                            </div>);
                    }
                    row.push(
                        <div key={`div ${i} - ${j}`} className="mapTile flex-column" style={{height: tileSize, width: tileSize }}>
                            {combinedDiv}
                        </div>);
                }
                else
                for (let k = 0; k < map[i][j].length; k++){
                    row.push(
                        <MapTile key={`tile ${i} - ${j}`} value={getmapTile( map[i][j][k].tile, this.props.tileSize)} />
                    );
                }
                if (map[i][j].length  === 0){
                    const tile = /*{...*/getmapTile(tileNames.empty, this.props.tileSize,);
                    row.push(
                        <MapTile key={`tile ${i} - ${j}`} value={tile} />
                    );
                }
            }
            elements.push(
                <div className="flex-row">
                    {row}
                </div>
            )
        }
        return (
            <div className="flex-column flex-align-start" style={{position: "relative"}} >
                {this.loadTank()}
                {this.loadTrails()}
                {elements}
            </div>
        );
    }

    loadTank(){
        const tileSize= this.props.tileSize;
        const {tank} = this.props;
        if (!tank) return null;
        const valueBody = {...getmapTile(tileNames.tankBody, this.props.tileSize),position: "absolute",
            zIndex:9997,
            left: tank.X * (tileSize + 2),
            top: tank.Y * (tileSize + 2),
            transform: `rotate(${tank.TankDirection}deg)`

        };
        const valueHead = {...getmapTile(tileNames.tankHead, this.props.tileSize),position: "absolute",
            zIndex:9998,
            left: tank.X * (tileSize + 2),
            top: tank.Y * (tileSize + 2),
            transform: `rotate(${tank.TurretDirection}deg)`
        };
        const status = this.props.tank.TurretStatus === 0
            ? tileNames.tankStatus_NotLoaded
            : this.props.tank.TurretStatus === 1
                ? tileNames.tankStatus_PartLoaded
                : tileNames.tankStatus_Loaded;

        const valueStatus = {...getmapTile(status, this.props.tileSize),position: "absolute",
            zIndex:9999,
            left: tank.X * (tileSize + 2),
            top: tank.Y * (tileSize + 2),
        };
        return (
            [
                 <div style={valueBody}></div>,
                 <div style={valueHead}></div>,
                 <div style={valueStatus}></div>
            ])
    }
    loadTrails(){
        const tileSize= this.props.tileSize;
        const {mapTracers} = this.props;
        if (mapTracers.length === 0) return null;

        const arr = [];
        const length = mapTracers.length;

        for (let i = 0; i < length; i++){
            const little = mapTracers[i].tag === tileNames.littleTrailDiag
                            || mapTracers[i].tag === tileNames.littleTrailVert;
            let left = mapTracers[i].X * (tileSize + 2)
                + (little? (tileSize / 3 ) * (mapTracers[i].XShift + 1) : 0);
            let top = mapTracers[i].Y * (tileSize + 2)
                + (little? -2 + (tileSize / 3 ) * (mapTracers[i].YShift + 1) :0);


            const value = {...getmapTile(mapTracers[i].tag, this.props.tileSize, little),position: "absolute",
                zIndex:9996,
                left: left,
                top: top,
                transform: `rotate(${mapTracers[i].inverted? 90 : 0 }deg)`
            };
            arr.push(
                <div style={value}></div>
            )
        }

        return arr;
    }

    fileLoad(evt){
        var files = evt.target.files; // FileList object
        var reader = new FileReader();
        const {loadMap} = this.props;
        reader.onload = (e) => {
            if (e.target.result === "sonic") {
                this.setState({sonic: true});
                document.getElementById('audio').play();
                document.getElementById('audio').volume=0.05;
            }
            else
            {
                loadMap(e.target.result);
                this.props.restart();
            }

            //console.log(typeof e.target.result)
        };
        reader.readAsText(files[0].slice());
    }

    hideSonic(){
        const t =document.getElementById('audio');
        t.pause();
        t.currentTime =0;
        this.setState({sonic: false});
    }

    render() {
        return (
            <div>
                <div id="mapTitle" className="flex-row flex-justify-between">
                    <label id="labelFor_uploadMap" htmlFor="uploadMap">
                        <div style={getMenuButtons(6)}/>
                    </label>
                    <input id="uploadMap" type="file" onChange={(e) => this.fileLoad(e)}/>
                    <div className="flex-row">
                        <span>Приближение</span>
                        <MenuButton image={getMenuButtons(8)}
                                    onClick={()=>this.props.zoomIn()}
                        />
                        <MenuButton image={getMenuButtons(9)}
                                    onClick={()=>this.props.zoomOut()}
                        />
                        <div >{this.props.tileSize} </div>
                    </div>
                </div>
                <div id="mapCont" className="overflow-visible" >
                        {this.renderTable()}
                </div>
                <audio id="audio" src="../sanic.mp3" preload="auto" style={{display:"none"}} loop  />

                <ReactModal id="her" isOpen={this.state.sonic}
                            onRequestClose={() => this.hideSonic()} >
                    <style>
                        {
                            `
                            @-webkit-keyframes sonic {
                                0% {
                                    left: -50%;
                                    top:0
                                    transform: scale(1, 1);
                                }
                                50% {
                                    left: 130%;
                                    top:0;
                                    transform: scale(1, 1);
                                }
                                51% {
                                    left: 130%;
                                    top:70%;
                                    transform: scale(-1, 1);
                                }
                                99% {
                                    left: -50%;
                                    top:70%;
                                }
                                100% {
                                    left: -50%;
                                    top:0;
                                    transform: scale(-1, 1);
                                }
                                }`
                        }
                    </style>
                    {/*<div style={{width:"90%", height:"90%", textAlign:"center", verticalAlign:"center",*/}
                                {/*position: "relative"}} >*/}
                        <img src="../images/sanic.png" alt ="" style={{width:300, height:300, position:"fixed",
                            animation: "sonic 2s infinite linear"}} onClick={()=>this.hideSonic()} />
                    {/*</div>*/}
                </ReactModal>
            </div>
        )
    }
}

function MapTile(props) {
    const value = {
        backgroundImage: props.value.backgroundImage,
        backgroundPosition:  props.value.backgroundPosition,
        border: props.value.border,
        height: props.value.height,
        width: props.value.width,
        backgroundSize: props.value.backgroundSize,
    };
    return(
        <div className="mapTile" style={value} onClickCapture={()=>props.onClick()}>
        </div>
    )
}

const WrappedMapTable = connect(putStateToProps_Map, putActionsToProps_Map)(MapTable);

export default Map