import React, { useContext, useEffect, useState } from 'react'
import VentasGenerales from './VentasGenerales';
import { ClienteProvider } from '../../context/Catalogos/crearClienteCtx';
import AbrirTurno from '../ventas/AbrirCerrarTurno/AbrirTurno';
import { Box, CircularProgress, Grid, Paper, Typography } from '@material-ui/core';
import { VentasContext } from '../../context/Ventas/ventasContext';

export default function VentaIndex() {

    const { turnoActivo, setTurnoActivo } = useContext(VentasContext);
    const [ varActive, setVarActive ] = useState(false);
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));

    useEffect(() => {
        const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
        setVarActive(sesion.turno_en_caja_activo);
        setTurnoActivo(false);
    }, [ turnoActivo ]);

    return (
        <ClienteProvider>
            {varActive === true && turnoEnCurso ? (
                <VentasGenerales />
            ) : (
                <AbrirTurnoEnVentas />
            )}
        </ClienteProvider>
    )
};

function AbrirTurnoEnVentas() {

    const [loading, setLoading] = useState(false);

	if (loading) 
	return (
		<Box
		display="flex"
		flexDirection="column"
		justifyContent="center"
		alignItems="center"
		height="80vh"
		>
			<CircularProgress />
		</Box>
	);

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box mt={5} >
                <Paper elevation={5}>
                    <Box p={2} textAlign="center">
                        <Typography variant="h6">
                            Si deseas realizar ventas inicia tu turno primeramente.
                        </Typography>
                    </Box>
                    <AbrirTurno type="FRENTE" setLoading={setLoading} />
                </Paper>
            </Box>
        </Grid>
    )
}
