import { Button, Box, Typography, FormControl, Select, MenuItem} from '@material-ui/core'
import React from 'react'

import AddIcon from '@material-ui/icons/Add';



export default function RegistroProvedor() {

    return (
        <>
            <Box mx={2}>
                <Typography>Elige proveedor</Typography>
            </Box>
            <Box width="20%" >
                <FormControl variant="outlined" fullWidth size="small">
                    <Select id="form-proveedor" /* value={age} */ /* onChange={handleChange} */>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mx={3}>
                <Button 
                    autoFocus 
                    color="inherit"
                    variant="outlined" 
                    size="large" 
                    startIcon={<AddIcon fontSize="large" />}
                >
                    Nuevo Provedor
                </Button>
            </Box>
        </>
    )
}
