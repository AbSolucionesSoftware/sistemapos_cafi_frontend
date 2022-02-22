import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { ELIMINAR_CAJA } from "../../../../gql/Cajas/cajas";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "55vh",
  },
}));

export default function TablaCajas({
  obtenerCajasSucursal,
  setAlert,
  refetch,
}) {
  const permisos = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Cajas</TableCell>
                {permisos.accesos.catalogos.cajas.eliminar === false ? null : (
                  <TableCell padding="default">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerCajasSucursal.map((row) => {
                return (
                  <RowCajasRender
                    key={row.numero_caja}
                    row={row}
                    permisos={permisos}
                    setAlert={setAlert}
                    refetch={refetch}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RowCajasRender = ({ row, permisos, setAlert, refetch }) => {
  const [loading, setLoading] = useState(false);
  const [eliminarCaja] = useMutation(ELIMINAR_CAJA);

  const deleteCaja = async (id) => {
    try {
      setLoading(true);
      await eliminarCaja({
        variables: {
          id: id,
        },
      });
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  return (
    <TableRow role="checkbox" tabIndex={-1}>
      <TableCell> CAJA {row.numero_caja}</TableCell>
      {permisos.accesos.catalogos.cajas.eliminar === false ? null : (
        <TableCell padding="checkbox">
          <IconButton onClick={() => deleteCaja(row._id)}>
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <Delete />
            )}
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};
