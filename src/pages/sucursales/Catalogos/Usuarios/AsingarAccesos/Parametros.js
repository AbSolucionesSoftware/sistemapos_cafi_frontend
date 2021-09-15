import { Box, Checkbox, FormControlLabel } from '@material-ui/core'
import React, {useState} from 'react'

export default function Parametros({ arregloAccesos, obtenerCatalogos, departamento, subDepartamento}) {

    const [activo, setActivo] = useState(false);

    const verficarDatos = () => {
        
    };

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
                label="Ver"
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
                label="Agregar"
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
                label="Editar"
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
                label="Eliminar"
            />
        </Box>
    )
}
