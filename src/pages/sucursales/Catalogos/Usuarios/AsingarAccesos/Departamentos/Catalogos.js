import {
  Box,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";

export default function Catalogos({ obtenerCatalogos, arregloAccesos }) {
    
    return (
        <Fragment>
            <Box>
                <Typography variant="h6">
                    Marca los permisos que deseas asignar a este usuario
                </Typography>
            </Box>
            <Box mt={1}>
                <Paper elevation={3}>
                    <Box display='flex'>
                        <Box ml={3} p={2} flexGrow={1}>
                            <Typography variant="h6">
                                <b>Clientes</b>
                            </Typography>
                        </Box>
                        <Parametros 
                            arregloAccesos={arregloAccesos} 
                            obtenerCatalogos={obtenerCatalogos}
                            departamento={'catalogos'}
                            subDepartamento={'clientes'}
                        />
                    </Box>
                </Paper>
            </Box>
            <Box mt={1}>
                <Paper elevation={3}>
                    <Box display='flex'>
                        <Box ml={3} p={2} flexGrow={1}>
                            <Typography variant="h6">
                                <b>Usuarios</b>
                            </Typography>
                        </Box>
                        <Parametros 
                            arregloAccesos={arregloAccesos} 
                            obtenerCatalogos={obtenerCatalogos}
                            departamento={'catalogos'}
                            subDepartamento={'usuarios'}
                        />
                    </Box>
                </Paper>
            </Box>
        </Fragment>
    );
};

