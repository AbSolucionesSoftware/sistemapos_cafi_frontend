import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root:{
        marginTop: theme.spacing(2)
    },
    rootPrecioProductos:{
        minHeight: '40vh',
    },
    containerImage:{
        maxWidth: 150,
        maxHeight: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'ceter'
    },
    imagen:{
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'ceter'
    },
    rootBusqueda: {
        height: 35,
		display: 'flex',
		padding: theme.spacing(1),
        // marginTop: theme.spacing(1)
	},
    rootBusquedaProductos: {
        height: 35,
		display: 'flex',
		padding: theme.spacing(1),
        // marginTop: theme.spacing(1)
	},
    rootFecha: {
        height: 40,
        maxWidth: 150,
		display: 'flex',
	},
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(.5)}px`
		},
		'& .obligatorio': {
			color: 'red'
		},
        paddingTop: 0,
        alignItems: "center",
        justifyItems: "center"
	},
	formInput: {
		// margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    iconSize: {
		width: 28,
	},
    iconSizeDialogs:{
        width: 80,
    },
    iconSizeDialogsPequeno:{
        width: 50,
    },
    containerImagenesProducto:{
        maxHeight: 300,
        maxWidth: 300,
        display: 'flex',
        justifyItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagenProducto:{
        height: '100%',
        width: '100%'
    },
    borderBoton:{
		minWidth: '100%',
		height: '50%',
        border: '.6px solid #DBDBDB'
    },
	borderBotonChico:{
		minWidth: '100%',
		height: '100%',
        border: '.6px solid #DBDBDB'
    },
    input: {
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
    },
}));

export default useStyles