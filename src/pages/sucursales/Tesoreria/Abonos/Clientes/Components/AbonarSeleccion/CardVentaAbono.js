import React,{useState, useContext} from 'react';
import { Box, Grid, makeStyles, Typography, TextField, IconButton } from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
import BallotIcon from '@material-ui/icons/Ballot';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
	formatoFechaCorta,
    formatoMexico
  } from "../../../../../../../config/reuserFunctions";
import DetalleVentaCredito from './DetalleVentaCredito';
import {AbonosCtx} from "../../../../../../../context/Tesoreria/abonosCtx";

const useStyles = makeStyles({
    root: {
      minWidth: 332,
      maxWidth: 332,
      height: 260,
      maxHeight: 260,  
    },
    content:{
      height: 210,
      
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 16,
    },
    pos: {
      marginBottom: 12,
    },
  });

export default function CardVenta(props){
    const {abonos, setAbonos }= useContext(AbonosCtx);
    const classes = useStyles();
    const datos = props.datos;
    const [openDetalle, setOpenDetalle] = useState(false);
    const [cantidad, setCantidad] = useState(0);

    const enviarDatos = (e) =>{
        setCantidad( e.target.value);
        let abonosHere = abonos;
        let exist = false;
       
        abonosHere.forEach(abono => {
            if (abono.idVenta === datos._id) {
                abono.cantidad_abonar = e.target.value;
                exist = true;
            }      
        });

        if(!exist){
            abonosHere.push({idVenta: datos._id, cantidad_abonar:e.target.value});
        }
       
        setAbonos(abonosHere);
     
    };

    return(
    <Box
        sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'stretch',
       
        p: 1,
        m: 1,
        }}
    >
        <Card className={classes.root}>
        <CardContent className={classes.content}>
           
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Fecha de venta </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                {` ${formatoFechaCorta(datos.fecha_registro)}`}
                   
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Folio </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                    {datos.folio}
                </Typography>
            </Box>
            {
                (datos.abonos.length) ? 
                <Box display='flex' flexDirection="row" m={1}>
                    <Typography className={classes.title} color="textSecondary" >
                        <b>Último abono </b>
                        
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" >
                        {datos.abonos[datos.abonos.length].fecha_movimiento.completa}
                    </Typography>
                </Box>
                :
                <div/>

            }
          
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between" >
                <Typography className={classes.title} color="textSecondary" >
                    <b>Total venta </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                   ${ formatoMexico(datos.total)}
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Debe </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary"  ml={2} >
                    ${ formatoMexico(datos.saldo_credito_pendiente)}
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography style={{marginTop:5, marginRight:10}}>
                    <b>Abonar </b>
                </Typography>
                <TextField
                    style={{width:'45%', marginLeft:15}}
                    type="number"
                    size="small"
                    variant="outlined"
                    onChange={(enviarDatos)} 
                    value={cantidad}
                />
            </Box>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
            <IconButton aria-label="delete" onClick={() =>console.log(abonos)} >
                <HistoryIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => setOpenDetalle(true)} >
                <BallotIcon />
            </IconButton>
            
        </CardActions>
        </Card>
        <DetalleVentaCredito openDetalle ={openDetalle} setOpenDetalle={setOpenDetalle} datos={datos} />
    </Box>
    )
}