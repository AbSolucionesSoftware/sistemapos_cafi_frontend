import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid, Typography } from '@material-ui/core'
import { FcExpired } from 'react-icons/fc';

export default function VentaEnEspera({handleClickOpen}) {

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box
                        display="flex" 
                        textAlign="center" 
                        justifyContent="center" 
                        alignContent="center" 
                        alignSelf="center"
                        justifySelf="center"
                    >
                        <Box>
                            <FcExpired style={{fontSize: 80}} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h5">
                                Venta pasada a espera
                            </Typography>
                        </Box>
                    </Box>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="outlined" color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}
