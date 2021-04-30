import React, { useRef, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack';

import { makeStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import {
	Button,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import LockIcon from '@material-ui/icons/Lock';

import { useAuth } from "../Login/loginProvider";

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
		textAlign: "center",
	},
	center: {
		textAlign: "center",
	},
}));

function Login() {
	const classes = useStyles();
	const { login } = useAuth();
	const emailRef = useRef();
	const passwordRef = useRef();
	const { enqueueSnackbar } = useSnackbar();
	const [errorEmail, setErrorEmail] = useState({ error: false, errorMsj: "" });
	const [errorPass, setErrorPass] = useState({ error: false, errorMsj: "" });
	const [loading, setLoading] = useState(false)
	const history = useHistory()

	const handleClick = (e) => {
		e.preventDefault();
		setLoading(true)
		login(emailRef.current.value, passwordRef.current.value)
		.then(() =>{
			setLoading(false)
			history.push("/home")
		})
		.catch((error) => {
			console.log(error)
			if(error.code === "auth/wrong-password" || error.code === "auth/user-not-found"){
				enqueueSnackbar('Usuario o contraseña incorrecto', {variant: 'error'});
			}
		});
	};

	const handleChangeEmail = (e) =>{
		(e.target.value !== "") ? setErrorEmail({ error: false, errorMsj: "" }) : setErrorEmail({ error: true, errorMsj: "Ingrese email" });
	}

	const handleChangePassword = (e) =>{
		if(e.target.value === ""){
			setErrorPass({ error: true, errorMsj: "Ingrese contraseña" })
		}
		else if(e.target.value.length < 6){
			setErrorPass({ error: true, errorMsj: "Contraseña debe tener un mínimo de 6 caracteres" }) 
		}
		else{
			setErrorPass({ error: false, errorMsj: "" })
		}
			
	}

	return (
		<Container maxWidth="sm">
			<Card className={classes.root}>
				<CardContent className={classes.center}>
					<Grid
						container
						spacing={0}
						direction="column"
						alignItems="center"
						justify="center"
						style={{ minHeight: "100vh" }}
					>
						<form onSubmit={handleClick}>
							<div className={classes.margin}>
								<Grid container spacing={1} alignItems="flex-end">
									<Grid item>
										<AccountCircle />
									</Grid>
									<Grid item>
										<TextField
											onChange={handleChangeEmail}
											error={errorEmail.error}
											helperText={errorEmail.errorMsj}
											label="Email"
											inputRef={emailRef}
										/>
									</Grid>
								</Grid>
							</div>
							<div className={classes.margin}>
								<Grid container spacing={1} alignItems="flex-end">
									<Grid item>
										<LockIcon />
									</Grid>
									<Grid item>
										<TextField
											error={errorPass.error}
											helperText={errorPass.errorMsj}
											type="password"
											label="Contraseña"
											inputRef={passwordRef}
											onChange={handleChangePassword}
										/>
									</Grid>
								</Grid>
							</div>
							<div className={classes.margin}>
								<Grid container spacing={1} alignItems="flex-end">
									<Grid item>
										<Typography>
											<Link to={{
												pathname: "/singUp"
											}}>¿No tienes Cuenta? {loading}</Link>
										</Typography>
									</Grid>
									<Grid item>
										{!loading ? 
											<Button disabled={errorEmail.error || errorPass.error} variant="contained" color="primary" type="submit">
												Login
											</Button>
										:
										<CircularProgress />
										}
									</Grid>
								</Grid>
							</div>
						</form>
					</Grid>
				</CardContent>
			</Card>
		</Container>
	);
}

export default Login;
