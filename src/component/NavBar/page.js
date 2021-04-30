import React from "react";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";

import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";
import TrendingUpRoundedIcon from "@material-ui/icons/TrendingUpRounded";
import SettingsIcon from "@material-ui/icons/Settings";

import { useAuth } from "../Login/loginProvider";

import Configuracion from '../Configuracion/configuracion';
import Gastos from "../Gastos/index";
import Ultimos from "../Ultimos/ultimos";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Container fixed>{children}</Container>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		"aria-controls": `scrollable-force-tabpanel-${index}`,
	};
}
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	toolbar: {
		minHeight: 128,
		alignItems: "flex-start",
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
	},
	tabs: {
		flexGrow: 1,
	},
}));

function Page() {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const history = useHistory();
	const open = Boolean(anchorEl);
	const { currentUser, logout } = useAuth();

	const handleChangeTab = (event, newValue) => {
		setValue(newValue);
		console.log(currentUser);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleLogout = () => {
		logout().then(() => {
			history.push("/login");
		});
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.title} variant="h5" noWrap>
						GastosApp
					</Typography>
					<Tabs
						className={classes.tabs}
						value={value}
						variant="scrollable"
						onChange={handleChangeTab}
						aria-label="full width tabs example"
					>
						<Tab
							label="Gastos"
							{...a11yProps(0)}
							icon={<AttachMoneyRoundedIcon />}
						/>
						<Tab
							label="Resumen"
							{...a11yProps(1)}
							icon={<TrendingUpRoundedIcon />}
						/>
						<Tab
							label="Configuración"
							{...a11yProps(2)}
							icon={<SettingsIcon />}
						/>
					</Tabs>
					<IconButton
						aria-label="more"
						aria-haspopup="true"
						edge="end"
						color="inherit"
						onClick={handleClick}
					>
						<MoreVertIcon />
					</IconButton>
					<Menu
						id="long-menu"
						anchorEl={anchorEl}
						keepMounted
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={handleLogout}>
							Cerrar Sesión
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Gastos />
				<Ultimos />
			</TabPanel>
			<TabPanel value={value} index={1}></TabPanel>
			<TabPanel value={value} index={2}>
				<Configuracion/>
			</TabPanel>
		</div>
	);
}

export default Page;
