import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import { Close, CropOriginal, ListAlt } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  drawWidth: {
    width: "50vw",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
  },
}));

export default function InfoProductoDrawer({ producto }) {
  const { datos_generales, imagenes } = producto;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <div>
      <IconButton
        color="default"
        variant="contained"
        onClick={() => toggleDrawer()}
      >
        <ListAlt />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => toggleDrawer()}>
        <div className={classes.drawWidth}>
          <Grid container>
            <Grid
              item
              md={imagenes.length > 1 ? 6 : 12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                m={1}
                width="300px"
                height="300px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {imagenes.length > 0 ? (
                  <img
                    width="100%"
                    alt="img producto"
                    src={imagenes[0].url_imagen}
                    /* src="https://www.dportenis.mx/wcsstore/ExtendedSitesCatalogAssetStore/images/catalog/zoom/1020139-0001V1.jpg" */
                  />
                ) : (
                  <CropOriginal style={{ fontSize: 90 }} />
                )}
              </Box>
            </Grid>
            {imagenes.length > 1 ? (
              <Grid item md={6}>
                <Grid container>
                  {imagenes.map((res, index) => {
                    return index > 0 ? (
                      <Grid item key={index}>
                        <Box
                          m={1}
                          key={index}
                          height={120}
                          width={120}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <img
                            width="100%"
                            alt="img producto"
                            src={res.url_imagen}
                          />
                        </Box>
                      </Grid>
                    ) : null;
                  })}
                </Grid>
              </Grid>
            ) : null}
          </Grid>
          <Box m={5}>
            <Grid container spacing={3} justify="center">
              <Grid item>
                <Typography>
                  <b>Código de barras: </b>
                  {datos_generales.codigo_barras
                    ? datos_generales.codigo_barras
                    : "-"}
                </Typography>
                <Typography>
                  <b>Clave alterna: </b>
                  {datos_generales.clave_alterna
                    ? datos_generales.clave_alterna
                    : "-"}
                </Typography>
                <Typography>
                  <b>Clave producto del SAT: </b>
                  {datos_generales.clave_producto_sat &&
                  datos_generales.clave_producto_sat.Value
                    ? datos_generales.clave_producto_sat.Value: "-"}
                </Typography>
                <Typography>
                  <b>Nombre comercial: </b>
                  {datos_generales.nombre_comercial
                    ? datos_generales.nombre_comercial
                    : "-"}
                </Typography>
                <Typography>
                  <b>Nombre genérico: </b>
                  {datos_generales.nombre_generico
                    ? datos_generales.nombre_generico
                    : "-"}
                </Typography>
                <Typography>
                  <b>Descripción: </b>
                  {datos_generales.descripcion
                    ? datos_generales.descripcion
                    : "-"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Tipo de producto: </b>
                  {datos_generales.tipo_producto
                    ? datos_generales.tipo_producto
                    : "-"}
                </Typography>
                <Typography>
                  <b>Categoria: </b>
                  {datos_generales.categoria ? datos_generales.categoria : "-"}
                </Typography>
                <Typography>
                  <b>Subcategoria: </b>
                  {datos_generales.subcategoria
                    ? datos_generales.subcategoria
                    : "-"}
                </Typography>
                <Typography>
                  <b>Departamento: </b>
                  {datos_generales.departamento
                    ? datos_generales.departamento
                    : "-"}
                </Typography>
                <Typography>
                  <b>Marca: </b>
                  {datos_generales.marca ? datos_generales.marca : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </div>
        <Box
          position="absolute"
          bottom={16}
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => toggleDrawer()}
            startIcon={<Close />}
          >
            Cerrar
          </Button>
        </Box>
      </Drawer>
    </div>
  );
}
