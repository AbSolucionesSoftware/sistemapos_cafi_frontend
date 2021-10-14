import { AppBar, Box, Button, Dialog, FormControl, Grid, MenuItem, Select, Slide, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { FcPaid } from 'react-icons/fc';
import TablaComprasFiltradas from './TablaComprasFiltradas';
import SaveIcon from '@material-ui/icons/Save';


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

export default function ReportesCompras() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen =()=>{setOpen(!open)};

    return (
        <>
            <Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <FcPaid fontSize={100} />
					</Box>
					Reportes Compras
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Reportes Compras
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <Grid container>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="Guardar"
                        className={classes.iconSave}
                    >
                        <SaveIcon className={classes.margin} />
                        Exportar
                    </Button>
                    <Grid item lg={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Fecha inicio:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fechaInicio"
                                    variant="outlined"
                                    type="date"
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Fecha fin:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fechaFin"
                                    variant="outlined"
                                    type="date"
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Provedor:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="provedor"
                                    variant="outlined"
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Formas:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-producto-tipo"
                                        name="tipo_producto"
                                    >
                                        <MenuItem value="">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        <MenuItem value="CREDITO">Credito</MenuItem>
                                        <MenuItem value="CONTADO">Contado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Metodos de Pago:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-producto-tipo"
                                        name="tipo_producto"
                                    >
                                        <MenuItem value="">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        <MenuItem value="TARJETA">Tarjeta</MenuItem>
                                        <MenuItem value="TRANSFERENCIAS">Transferencias</MenuItem>
                                        <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Productos:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="provedor"
                                    variant="outlined"
                                />
                            </Box>
                        </div>
                    </Grid> 
                    <Grid item lg={12}>
                        <TablaComprasFiltradas />
                    </Grid>
                    
                </Grid>            
			</Dialog> 
        </>
    )   
}
