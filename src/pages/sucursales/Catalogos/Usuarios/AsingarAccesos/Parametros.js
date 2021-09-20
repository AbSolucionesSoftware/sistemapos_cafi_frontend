import { Box, Checkbox, FormControlLabel } from '@material-ui/core'
import React from 'react';

export default function Parametros({ arregloAccesos, obtenerAccesos, departamento, subDepartamento}) {

    return(
        <Box display='flex' justifyContent='center' alignItems='center'>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver : false}
                        name="ver"
                        color="primary"
                        onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
                    />
                }
                label={
                    <Box mr={2} display='flex'>
                        Ver
                    </Box>
                }
            />
            {   subDepartamento === 'informacion_fiscal' ||
                subDepartamento === 'datos_empresa' ? (null):(
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].agregar : false}
                                name="agregar"
                                disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                                color="primary"
                                onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
                            />
                        }
                        label={
                            <Box mr={2}  display='flex'>
                                Agregar
                            </Box>
                        }
                    />
            )}
            {   subDepartamento === 'cajas' ? (null):( 
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].editar : false}
                            name="editar"
                            disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                            color="primary"
                            onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
                        />
                    }
                    label={
                        <Box mr={2}  display='flex'>
                            Editar
                        </Box>
                    }
                />
            )}
            {   subDepartamento === 'informacion_fiscal' ||
                subDepartamento === 'datos_empresa' ? (null):( 
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={arregloAccesos ? arregloAccesos[departamento][subDepartamento].eliminar : false}
                            name="eliminar"
                            color="primary"
                            disabled={arregloAccesos ? arregloAccesos[departamento][subDepartamento].ver === false : true}
                            onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
                        />
                    }
                    label={
                        <Box display='flex'>
                            Eliminar
                        </Box>
                    }
                />
            )}
        </Box>
    )
}
