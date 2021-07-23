import React, { useState } from 'react'

import { Box, Grid, makeStyles, Typography, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core'

import InputAdornment from '@material-ui/core/InputAdornment';

import TablaAbonosClientes from './TablaAbonosCliente';
import TablaComprasClientes from './TablaComprasCliente';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

export default function DatosAbonoCliente() {
    
    const [liquidar, setLiquidar] = useState(false);
    const classes = useStyles();

    const handleChange = (e) =>{
        setLiquidar(e.target.checked)
    }

    return (
        <div>
            <Grid container>
                <Grid item lg={12}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Nombre de Cliente:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    Hola mundo
                                </Typography>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>Total Abonado:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    $15,000
                                </Typography>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>Restante:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    $0.0
                                </Typography>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>Total a liquidar:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    $15,000
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="50%">
                            <Typography>Nuevo abono: </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                /* error */
                                name="abono"
                                id="abono"
                                variant="outlined"
                                disabled={liquidar}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                /* value="" */
                                /* helperText="Incorrect entry." */
                                /* onChange={obtenerCampos} */
                            />
                        </Box>
                        <Box width="100%" p={3}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    onChange={handleChange}
                                    name="checkedB"
                                    color="primary"
                                />
                                }
                                label="Liquidar cuenta"
                            />
                            <Button
                                autoFocus 
                                color="primary"
                                size="large"
                                variant="outlined"
                            >
                               {!liquidar ? 'Agregar abono' : 'Liquidar cuenta'}
                            </Button>
                        </Box>
                    </div>
                </Grid>
                <Grid container>
                    <Grid lg={6} xs={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%" >
                                <Typography variant='h6' >Abonos dados</Typography>
                            </Box>
                        </div>
                        <Box p={2}>
                            <TablaAbonosClientes />
                        </Box>
                    </Grid>
                    <Grid lg={6} xs={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%" >
                                <Typography variant='h6'>Lista de compras</Typography>
                            </Box>
                        </div>
                        <Box p={2}>
                            <TablaComprasClientes />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </div>

    )
}
