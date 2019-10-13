import React, {Component} from 'react';
import Menu from './components/menu.js'
import Map from './components/map.js'
import ReactDOM from 'react-dom';
import './styles/game.css';
import './styles/scroll.css';


class Game extends Component {
    render() {
        return (
            <div style={{display:"flex", flexDirection:"column"}}>
                <div id="snavigator">Танковый Биатлон</div>
                <div id="gridMain" >
                    <Map />
                    <Menu />
                </div>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

