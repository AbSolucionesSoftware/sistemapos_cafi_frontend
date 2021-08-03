import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
    formInputFlex: {
        display: 'flex',
        '& > *': {
            margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
        }
    },
    formInput: {
        margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    }
}));

export default function CentroCostos({ obtenerConsultasProducto }) {
    const classes = useStyles();
    const { centro_de_costos, setCentroDeCostos, subcostos, setSubcostos } = useContext(RegProductoContext);
    const { centro_costos } = obtenerConsultasProducto;

    const obtenerAlmacenes = (event, child) => {
        setCentroDeCostos({
            ...centro_de_costos,
            [event.target.name]: event.target.value,
            [child.props.name]: child.props.id,
        });
        if (child.props.costos) {
            const { subcostos } = child.props.costos;
            setSubcostos(subcostos);
        }
    };
    
    return (
        <Fragment>
            <Box mt={3}>
                <Typography>
                    <b>Centro de costos</b>
                </Typography>
                <Divider />
            </Box>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Costos</Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" fullWidth size="small" name="cuenta">
                            <Select name="cuenta" value={centro_de_costos.cuenta ? centro_de_costos.cuenta : ''} onChange={obtenerAlmacenes}>
                                <MenuItem value="">
                                    <em>Seleccione uno</em>
                                </MenuItem>
                                {centro_costos ? centro_costos.map((res) => {
                                    return (
                                        <MenuItem
                                            name="id_cuenta"
                                            key={res._id}
                                            value={res.costo}
                                            id={res._id}
                                            costos={res}
                                        >
                                            {res.costo}
                                        </MenuItem>
                                    );
                                }) : <MenuItem value="" />}
                            </Select >
                        </FormControl>
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>Subcostos</Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" fullWidth size="small" name="sub_cuenta">
                            <Select name="sub_cuenta" value={centro_de_costos.sub_cuenta ? centro_de_costos.sub_cuenta : ''} onChange={obtenerAlmacenes}>
                                <MenuItem value="">
                                    <em>Seleccione uno</em>
                                </MenuItem>
                                {subcostos ? subcostos.map((res) => {
                                    return (
                                        <MenuItem
                                            name="id_sub_cuenta"
                                            key={res._id}
                                            value={res.subcosto}
                                            id={res._id}
                                        >
                                            {res.subcosto}
                                        </MenuItem>
                                    );
                                }) : <MenuItem value="" />}
                            </Select >
                        </FormControl>
                    </Box>
                </Box>
            </div>
        </Fragment>
    );
}
