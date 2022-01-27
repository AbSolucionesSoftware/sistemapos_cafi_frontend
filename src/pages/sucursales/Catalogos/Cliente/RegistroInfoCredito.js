import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, Grid } from "@material-ui/core";
import { TextField, Typography } from "@material-ui/core";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "500",
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
      <Box my={3}>
        <Alert severity="info">
          Si deseas hacer facturas a este cliente el <b>RFC</b> y la{" "}
          <b>Razon social</b> son obligatorios.
        </Alert>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Typography className={classes.title}>RFC</Typography>
          <TextField
            fullWidth
            size="small"
            name="rfc"
            variant="outlined"
            value={cliente.rfc ? cliente.rfc.toUpperCase() : ""}
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography className={classes.title}>Razon social</Typography>
          <TextField
            fullWidth
            size="small"
            name="razon_social"
            variant="outlined"
            value={
              cliente.razon_social ? cliente.razon_social.toUpperCase() : ""
            }
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Descuento</Typography>
          <TextField
            fullWidth
            size="small"
            name="numero_descuento"
            variant="outlined"
            value={cliente.numero_descuento ? cliente.numero_descuento : ""}
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Limite de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="limite_credito"
            variant="outlined"
            value={cliente.limite_credito ? cliente.limite_credito : ""}
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Días de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="dias_credito"
            variant="outlined"
            value={
              cliente.dias_credito ? cliente.dias_credito.toUpperCase() : ""
            }
            onChange={obtenerCampos}
          />
        </Grid>
      </Grid>
      {tipo !== "CLIENTE" ? (
        <Fragment>
          <Box my={3}>
            <Typography className={classes.title}>
              Datos bancarios <b>(Para proovedores)</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title}>Banco</Typography>
              <TextField
                fullWidth
                size="small"
                name="banco"
                variant="outlined"
                value={cliente.banco ? cliente.banco.toUpperCase() : ""}
                onChange={obtenerCampos}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title}>
                No. de Cuenta Bancaria
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="numero_cuenta"
                variant="outlined"
                value={cliente.numero_cuenta ? cliente.numero_cuenta : ""}
                onChange={obtenerCampos}
              />
            </Grid>
          </Grid>
        </Fragment>
      ) : null}
    </Fragment>
  );
}
