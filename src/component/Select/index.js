import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';


import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { db } from '../../config/Firebase'

const useStyles = makeStyles((theme) =>({
	title: {
	  fontSize: 20,
	},
	button: {
		margin: theme.spacing(1),
		float: 'right'
	  },
  }));
  
function SelectGroup(props){
	const [labels, setLables] = useState([])
	const [categoria, setCategoria] = useState({value: ''})
	const classes = useStyles();
	
	useEffect(() => {

		db.ref('/categorias').on('value', querySnapShot => {
			let data = querySnapShot.val() ? querySnapShot.val() : {};
			setLables(Object.entries(data))
		})
		
	}, [])

	const { handleSelect } = props
	
	useEffect(() => {
		handleSelect(categoria.value)
	}, [categoria])
	

	const handleChange = (event) => {
		setCategoria({value: event.target.value})
	}
	
	
	return (
		<FormControl fullWidth className={classes.margin}>
			<InputLabel htmlFor="standard-adornment-amount">Categoría</InputLabel>
			<Select value ={categoria.value} native id="grouped-native-select" onChange={handleChange}>
			<option aria-label="None" value="" />
				{labels?.map((categoria, index) => (
					<optgroup key={index} label={categoria[0]}>
						{categoria?.map((a, index) => (
							(index%2 !== 0) ? 
								Object.keys(a).map( k => (
									<option key={a[k].id} value={a[k].id}>{a[k].nombre}</option>
								))
								:
								null
						))}
					</optgroup>
				))}
			</Select>
		</FormControl>
	)
}

export default SelectGroup;