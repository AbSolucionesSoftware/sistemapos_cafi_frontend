import { AppBar, Box, Button, Dialog, FormControl, Grid, MenuItem, Select, Slide, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import TablaComprasFiltradas from './TablaCortesFiltradas';
import ExportExcel from './ExportExcel';

import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS, OBTENER_CORTES_CAJA } from '../../../../gql/Cajas/cajas';
import { useDebounce } from 'use-debounce/lib';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		width: 100
	},
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& .obligatorio': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
    margin: {
		margin: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	},
}));

export default function ReportesCortes() {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const classes = useStyles();

    const [ open, setOpen ] = useState(false);
    const [ datosFiltro, setDatosFiltro ] = useState([]);
    const [value] = useDebounce(datosFiltro, 500);

    let cajas = [];
    let historialCortes = [];

    const cajasBase = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
		}
	});

    const { loading, data, error, refetch  }= useQuery( OBTENER_CORTES_CAJA,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
            input: {
                fecha_consulta: datosFiltro.fecha_consulta ? datosFiltro.fecha_consulta : "",
                usuario: value.usuario ? value.usuario : "", 
                numero_caja: datosFiltro.numero_caja ? parseInt(datosFiltro.numero_caja) : null
            }
		}
	});

    if(cajasBase.loading === false && loading === false){
        cajas = cajasBase.data.obtenerCajasSucursal;
        historialCortes = data.obtenerCortesDeCaja;
    }

    const handleClickOpen = () => {setOpen(!open)};

    const obtenerDatos = (e) => { 
        setDatosFiltro({...datosFiltro, [e.target.name]: e.target.value})
    };

    const filtrarProductos = (event) => {
		event.preventDefault();
        refetch();
	};
    
    const limpiarDatos = () => {
        setDatosFiltro([]);
    };
    
    return (
        <>
            <Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register.svg' 
                            alt="icono caja" 
                            style={{width: 100}}
                        />
					</Box>
					Reportes Cortes de caja
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Reportes Cortes de caja
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <Grid container>
                    <ExportExcel historialCortes={historialCortes} /> 
                    
                    <Grid item lg={12} md={12} xs={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Fecha de corte:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fecha_consulta"
                                    variant="outlined"
                                    type="date"
                                    onChange={obtenerDatos}
                                    value={datosFiltro.fecha_consulta ? datosFiltro.fecha_consulta : ""}
                                />
                            </Box>
                            <form onSubmit={filtrarProductos} style={{ display: 'flex', alignItems: 'center', width: "100%" }}>
                                <Box width="100%">
                                    <Typography>
                                        Usuario:
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="usuario"
                                        variant="outlined"
                                        onChange={obtenerDatos}
                                        value={datosFiltro.usuario ? datosFiltro.usuario : ""}
                                    />
                                </Box>
                            </form>
                            <Box width="100%">
                                <Typography>
                                    Caja:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-producto-tipo"
                                        name="numero_caja"
                                        onChange={obtenerDatos}
                                        value={datosFiltro.numero_caja ? datosFiltro.numero_caja : ""}
                                    >
                                        <MenuItem value="">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        {
                                            cajas?.map((caja) =>{
                                                return(
                                                    <MenuItem key={caja.numero_caja} value={caja.numero_caja}>
                                                        Caja {caja.numero_caja}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box 
                                width="100%" 
                                display="flex" 
                                justifyContent="center" 
                                alignItems="center"
                                mt={2}
                            >
                                <Button
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    onClick={limpiarDatos}
                                >
                                    Limpiar Filtro
                                </Button>
                            </Box>
                        </div>
                    </Grid> 
                    <Grid item lg={12} md={12} xs={12}>
                        <TablaComprasFiltradas cortes={historialCortes} loading={loading} />
                    </Grid>
                </Grid>            
			</Dialog> 
        </>
    )   
}
