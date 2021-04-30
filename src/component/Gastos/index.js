import React, { useState } from "react";

import { Card, CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";

import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { useSnackbar } from "notistack";

import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";

import { db } from "../../config/Firebase";
import { useAuth } from "../Login/loginProvider";

import SelectGroup from "../Select";

const useStyles = makeStyles((theme) => ({
	title: {
		fontSize: 20,
	},
	button: {
		margin: theme.spacing(1),
		float: "right",
	},
}));

function Gastos() {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const { currentUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [errorForm, setErrorForm] = useState({
		error: false,
		nombre: {
			error: false,
			msjError: "",
		},
		amount: {
			error: false,
			msjError: "",
		},
		desc: {
			error: false,
			msjError: "",
		},
		origen: {
			error: false,
			msjError: "",
		},
	});
	const [values, setValues] = useState({
		amount: "",
		nombre: "",
		desc: "",
		origen: "",
		categoria: "",
		userId: "",
	});

	const addCommas = (num) =>
		num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

	const checkAmount = (event) => {
		setValues({
			...values,
			amount: addCommas(removeNonNumeric(event.target.value)),
		});
	};

	const handleChange = (prop) => (event) => {
		switch (prop) {
			case "amount":
				checkAmount(event);
				break;
			default:
				setValues({ ...values, [prop]: event.target.value });
				break;
		}
	};

	const validateForm = () => {
		if (values.nombre === "") {
			setErrorForm({
				nombre: { error: true, msjError: "Ingrese Nombre" },
			});
		}
		if (values.amount && values.amount === "") {
			setErrorForm({
				amount: { error: true, msjError: "Ingrese Monto" },
			});
		}
		if (values.desc && values.desc === "") {
			setErrorForm({
				desc: { error: true, msjError: "Ingrese Descripción" },
			});
		}
		if (values.origen && values.origen === "") {
			setErrorForm({
				origen: { error: true, msjError: "Ingrese Origen" },
			});
		}

		if (
			values.origen.error ||
			values.desc.error ||
			values.amount.error ||
			values.nombre.error
		) {
			setErrorForm({ error: true });
		}
	};

	const sendForm = () => {
		const ref = db.ref("/");
		const gastosRef = ref.child(`gasto/${currentUser?.uid}`);
		try {
			gastosRef
				.push(
					{
						nombre: values.nombre,
						valor: values.amount,
						descripcion: values.desc,
						origen: values.origen,
						categoria: values.categoria,
						userId: currentUser.uid,
					},
					() => { }
				)
				.then(() => {
					enqueueSnackbar("Gasto agregado", { variant: "success" });
					setLoading(false);
					cleanInputs();
				});
		} catch (error) {
			alert(error);
			setLoading(false);
		}
	};

	const handleClick = (event) => {
		event.preventDefault();

		validateForm();
		setLoading(true);
		sendForm();
	};

	const cleanInputs = () => {
		setValues({
			amount: "",
			nombre: "",
			desc: "",
			origen: "",
			categoria: "",
			userId: "",
		});
		handleSelect();
	};

	const handleSelect = (e) => {
		setValues({ ...values, categoria: e });
	};

	return (
		<Card>
			<CardContent>
				<Typography
					className={classes.title}
					color="textPrimary"
					gutterBottom
				>
					Gastos
				</Typography>
				<form onSubmit={handleClick}>
					<Grid container spacing={1}>
						<FormControl component="fieldset">
							<RadioGroup
								row
								aria-label="position"
								name="position"
								defaultValue="top"
								onChange={handleChange("origen")}
							>
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
								<TextField
									id="nombre"
									error={errorForm?.nombre.error}
									helperText={errorForm?.nombre.msjError}
									value={values.nombre}
									label="Nombre"
									onChange={handleChange("nombre")}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth className={classes.margin}>
								<TextField
									id="amount"
									error={errorForm.nombre.amount}
									helperText={errorForm.nombre.amount}
									value={values.amount}
									onChange={handleChange("amount")}
									label="Dinero"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												$
											</InputAdornment>
										),
									}}
								/>
							</FormControl>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={8}>
							<FormControl fullWidth className={classes.margin}>
								<TextField
									id="desc"
									value={values.desc}
									label="Descripción"
									error={errorForm.nombre.desc}
									helperText={errorForm.nombre.desc}
									onChange={handleChange("desc")}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={4}>
							<SelectGroup handleSelect={handleSelect} />
						</Grid>
					</Grid>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Button
								variant="contained"
								color="primary"
								size="small"
								className={classes.button}
								startIcon={<SaveIcon />}
								disabled={loading || errorForm.error}
								type="submit"
							>
								Guardar
							</Button>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
}

export default Gastos;
