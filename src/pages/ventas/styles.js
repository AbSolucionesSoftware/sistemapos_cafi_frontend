import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	root:{
        marginTop: theme.spacing(2)
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
        marginTop: theme.spacing(1)
	},
    rootFecha: {
        height: 40,
        maxWidth: 150,
		display: 'flex',
	},
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
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
        width: 40,
    },
    containerImagenesProducto:{
        maxHeight: 320,
        maxWidth: 300
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
		height: '35%',
        border: '.6px solid #DBDBDB'
    }
}));

export default useStyles