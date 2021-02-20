import React from 'react';


import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { useSnackbar } from 'notistack';


import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';


import { db } from '../../config/Firebase'
import { useAuth } from "../Login/loginProvider";

import SelectGroup from '../Select';



const useStyles = makeStyles((theme) =>({
    title: {
      fontSize: 20,
    },
    button: {
        margin: theme.spacing(1),
        float: 'right'
      },
  }));

function Gastos() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { currentUser } = useAuth();
    const [values, setValues] = React.useState({
        amount: '',
        nombre: '',
        desc: '',
        origen: '',
        categoria: '',
        userId: ''
    });

    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
  

    const checkAmount = (event)=>{
        setValues({...values, amount: addCommas(removeNonNumeric(event.target.value))})
    }

    const handleChange = (prop) => (event) => {
        switch(prop){
            case "amount":
                checkAmount(event)
                break;
            default:
                setValues({ ...values, [prop]: event.target.value });
                break;
        }
    };

    const handleClick = (event) => {
        event.preventDefault()
        const ref = db.ref("/")
        const gastosRef = ref.child(`gasto/${currentUser.uid}`);
        try {
            gastosRef.push({
                "nombre": values.nombre,
                "valor": values.amount,
                "descripcion": values.desc,
                "origen": values.origen,
                "categoria": values.categoria,
                "userId": currentUser.uid
            }, () =>{
            }).then( () => {
                enqueueSnackbar('Gasto agregado', {variant: 'success'});
                cleanInputs()
            })
        } catch (error) {
            alert(error)
        }
    };

    const cleanInputs = () =>{
        setValues({
            amount: '',
            nombre: '',
            desc: '',
            origen: '',
            categoria: '',
            userId: ''
        })
        handleSelect()
    }

    const handleSelect = (e) =>{
        setValues({...values, categoria: e})
    }

    return (
        <Card>
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Gastos
                </Typography>
                <Grid container spacing={1}>
                    <FormControl component="fieldset">
                        <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={handleChange("origen")}>
                            <FormControlLabel
                                value="ingreso"
                                control={<Radio color="primary" />}
                                label="Ingreso"
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="egreso"
                                control={<Radio color="primary" />}
                                label="Egreso"
                                labelPlacement="start"
                            />
                        </RadioGroup>
                    </FormControl>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel htmlFor="standard-adornment-amount">Nombre</InputLabel>
                                <Input
                                    id="nombre"
                                    value={values.nombre}
                                    onChange={handleChange('nombre')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>      
                        <Grid item xs={6}>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel htmlFor="standard-adornment-amount">Dinero</InputLabel>
                                <Input
                                    id="amount"
                                    value={values.amount}
                                    onChange={handleChange('amount')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>      
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel htmlFor="standard-adornment-amount">Descripción</InputLabel>
                                <Input
                                    id="desc"
                                    value={values.desc}
                                    onChange={handleChange('desc')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                />
                            </FormControl>
                        </Grid>      
                        <Grid item xs={4}>
                            <SelectGroup handleSelect={handleSelect}/>
                        </Grid>      
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                onClick={handleClick}
                                startIcon={<SaveIcon />}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
            </CardContent>
        </Card>
    )
}

export default Gastos;