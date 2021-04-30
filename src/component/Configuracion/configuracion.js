import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardContent, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	title: {
		fontSize: 20,
	},
	button: {
		margin: theme.spacing(1),
		float: 'right'
	}
}));

function Configuracion(){
	const classes = useStyles();
	return(
		<Card>
			<CardContent>
			<Typography className={classes.title} color="textPrimary" gutterBottom>
					Configuración
				</Typography>
			</CardContent>
		</Card>
	)
}

export default Configuracion;