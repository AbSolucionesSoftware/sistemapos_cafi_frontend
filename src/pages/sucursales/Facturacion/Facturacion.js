import React from 'react'

import { Box, Container, Grid } from '@material-ui/core'

import NuevaFactura from './NuevaFactura/NuevaFactura';
import RegistroSellos from './CDFISellos/RegistrarSellos';
import RegistroSeries from './CDFISeries/RegistrarSeries';

export default function Facturacion() {
    return (
        <div>
            <Container>
                <Grid container spacing={2} justify="center">
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <NuevaFactura />
                        </Box>
                    </Grid>
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <RegistroSellos />
                        </Box>
                    </Grid>
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <RegistroSeries />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
