import { Box, Checkbox, FormControlLabel } from '@material-ui/core'
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

export default function Parametros({ arregloAccesos, obtenerCatalogos, departamento, subDepartamento}) {

    return(
        <Box display='flex' justifyContent='center' alignItems='center'>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver : false}
                        name="ver"
                        color="primary"
                        onChange={(e) => obtenerCatalogos(e, departamento, subDepartamento)}
                    />
                }
                label={
                    <Box mr={2} display='flex'>
                        Ver
                    </Box>
                }
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].agregar : false}
                        name="agregar"
                        disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                        color="primary"
                        onChange={(e) => obtenerCatalogos(e, departamento, subDepartamento)}
                    />
                }
                label={
                    <Box mr={2}  display='flex'>
                        Agregar
                    </Box>
                }
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].editar : false}
                        name="editar"
                        disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                        color="primary"
                        onChange={(e) => obtenerCatalogos(e, departamento, subDepartamento)}
                    />
                }
                label={
                    <Box mr={2}  display='flex'>
                         Editar
                    </Box>
                }
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].eliminar : false}
                        name="eliminar"
                        color="primary"
                        disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                        onChange={(e) => obtenerCatalogos(e, departamento, subDepartamento)}
                    />
                }
                label={
                    <Box display='flex'>
                         Eliminar
                    </Box>
                }
            />
        </Box>
    )
}
