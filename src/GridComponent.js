import React from "react"
import './App.css';
import GraphComponent  from './GraphComponent.js';
import NavigationComponent from "./NavigationComponent";
import { Grid, Box } from '@material-ui/core';

class GridComponent extends React.Component{

render(){
    return(
        <div>
            <NavigationComponent />
        
        <div class="grid-container">

        <div class="flex-child11 magenta">
        <GraphComponent  />
        butts go here
        </div>
        
        <div class="flex-child12 green">
        <GraphComponent  />
        buttons go here
        </div>
        
        <div class="flex-child21 magenta">
        <GraphComponent  />
        alaki nagoo
        </div>
        
        <div class="flex-child22 green">
        <GraphComponent  />
        menu component goes here
        </div>
    </div>
    </div>  


    )
}


}

export default GridComponent;