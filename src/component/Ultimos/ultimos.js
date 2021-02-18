import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React, { useEffect } from 'react'

import { db } from '../../config/Firebase'
import { useState } from 'react';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    card: {
        marginTop: '50px'
    },
    title: {
        fontSize: 20,
      },
  });

function Ultimos(){
    const classes = useStyles();
    const [gastos, setGastos] = useState([])

    useEffect(()=>{
        try{
            db.ref('/gasto').limitToLast(10).on("value", snapShot =>{
                let data = snapShot.val() ? snapShot.val() : {}
                setGastos(Object.values(data))
            })
        }
        catch(e){
            console.log(e)
        }
    }, [])

    const format = (val) => {
        return parseInt(val).toLocaleString('de-DE')
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title}  color="textPrimary" gutterBottom>
                    Últimos 10 movimientos
                </Typography>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Monto ($)</TableCell>
                            <TableCell align="right">Descripción</TableCell>
                            <TableCell align="right">Categoría</TableCell>
                            <TableCell align="right">SubCategoría</TableCell>
                            <TableCell align="right">Ingreso/Egreso</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {gastos.map( (row, i) => (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {row.nombre}    
                                    </TableCell>
                                    <TableCell align="right">${row.valor ? format(row.valor) : 0}</TableCell>
                                    <TableCell align="right">{row.descripcion}</TableCell>
                                    <TableCell align="right">{row.categoria}</TableCell>
                                    <TableCell align="right">{row.categoria}</TableCell>
                                    <TableCell align="right">{row.origen}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography>{gastos.length < 1 ? "No hay datos" : ""}</Typography>
            </CardContent>
        </Card>
    );
}

export default Ultimos;