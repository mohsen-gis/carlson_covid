import React, { Component } from 'react';
import { Grid, Button, Tooltip} from '@material-ui/core';
import Logo from "./img/logo.png";


var aboutText = "This web page was created by Dr. David Haynes' lab at the University of Minnesota. " +
    "COVID data is from the New York Time repository. Clusters are calculated daily using the Pysal library."

export default class RadioComponent extends Component {

    render() {
        return (
            <Grid container item direction="row" justify="left"
            style={{backgroundColor: '#ffcc33'}}>
                 <Grid item xs={7}>
                    <a href="https://healthinformatics.umn.edu/">
                        <img src={Logo} alt="University of Minnesota Logo" height="100vh" width="100%"/>
                    </a>
                </Grid>
                <Grid item xs={3}>
                    <h1>COVID Tracking Platform</h1>
                </Grid >
                <Grid container justify="flex-end" alignItems="center"  xs={2}>
                    <Grid item>
                        <a href="https://david-haynes-ds3k.squarespace.com/">
                            <Tooltip title={aboutText} aria-label="about">
                                <Button variant="outlined">About</Button>
                            </Tooltip>
                        </a>
                    </Grid>
                    <Grid item>
                    <a href="mailto:dahaynes@umn.edu">
                        <Button variant="outlined">Help</Button>
                    </a>
                </Grid> 
                </Grid>
            </Grid>
    );
    }
}