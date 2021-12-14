import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider } from "@material-ui/core";
import { TextField, Typography } from "@material-ui/core";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

export default function RegistrarInfoCredito({ tipo }) {
  const classes = useStyles();
  const { cliente, setCliente } = useContext(ClienteCtx);

  const obtenerCampos = (e) => {
    const name = e.target.name;
    if (name === "numero_descuento" || name === "limite_credito") {
      setCliente({
        ...cliente,
        [e.target.name]: parseInt(e.target.value),
      });
      return;
    }
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Fragment>
      <Box my={2}>
        <Alert severity="info">
          Si deseas hacer facturas a este cliente el <b>RFC</b> y la <b>Razon social</b> son
          obligatorios.
        </Alert>
      </Box>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <Typography>RFC</Typography>
          <TextField
            fullWidth
            size="small"
            name="rfc"
            variant="outlined"
            value={cliente.rfc ? cliente.rfc : ""}
            onChange={obtenerCampos}
          />
        </Box>
        <Box width="100%">
          <Typography>Razon social</Typography>
          <TextField
            fullWidth
            size="small"
            name="razon_social"
            variant="outlined"
            value={cliente.razon_social ? cliente.razon_social : ""}
            onChange={obtenerCampos}
          />
        </Box>
      </div>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <Typography>Descuento</Typography>
          <TextField
            fullWidth
            size="small"
            name="numero_descuento"
            variant="outlined"
            value={cliente.numero_descuento ? cliente.numero_descuento : ""}
            onChange={obtenerCampos}
          />
        </Box>
        <Box width="100%">
          <Typography>Limite de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="limite_credito"
            variant="outlined"
            value={cliente.limite_credito ? cliente.limite_credito : ""}
            onChange={obtenerCampos}
          />
        </Box>
        <Box width="100%">
          <Typography>Días de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="dias_credito"
            variant="outlined"
            value={cliente.dias_credito ? cliente.dias_credito : ""}
            onChange={obtenerCampos}
          />
        </Box>
      </div>
      {tipo !== "CLIENTE" ? (
        <Fragment>
          <Box my={3}>
            <Typography>
              Datos bancarios <b>(Para proovedores)</b>
            </Typography>
            <Divider />
          </Box>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>Banco</Typography>
              <TextField
                fullWidth
                size="small"
                name="banco"
                variant="outlined"
                value={cliente.banco ? cliente.banco : ""}
                onChange={obtenerCampos}
              />
            </Box>
            <Box width="100%">
              <Typography>No. de Cuenta Bancaria</Typography>
              <TextField
                fullWidth
                size="small"
                name="numero_cuenta"
                variant="outlined"
                value={cliente.numero_cuenta ? cliente.numero_cuenta : ""}
                onChange={obtenerCampos}
              />
            </Box>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
}
