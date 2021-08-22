import { Button, Box, Typography, FormControl, Select, MenuItem, IconButton, Grid} from '@material-ui/core'
import React from 'react'

import AddIcon from '@material-ui/icons/Add';



export default function RegistroProvedor() {

    return (
        <>
            <Box mx={2}>
                <Typography>Elige tu proveedor</Typography>
            </Box>
            <Box width="100%" >
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
            <Box>
                <IconButton 
					size="large"
                    color="primary"
                >
					<AddIcon fontSize="large" />
				</IconButton>
            </Box>
        </>
    )
}
