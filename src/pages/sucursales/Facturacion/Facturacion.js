import React from 'react'

import { Box, Container, Grid } from '@material-ui/core'

import NuevaFactura from './NuevaFactura/NuevaFactura';
import SeriesCDFI from './CFDISeries/SeriesCdfi';
import SellosCDFI from './CFDISellos/SellosCdfi';
import FacturasRealizadas from './FacturasRealizadas/FacturasRealizadas';

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
                            <FacturasRealizadas />
                        </Box>
                    </Grid>
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <SellosCDFI />
                        </Box>
                    </Grid>
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <SeriesCDFI />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
