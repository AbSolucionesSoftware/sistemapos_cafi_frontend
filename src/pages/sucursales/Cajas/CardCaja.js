import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function CardCaja() {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h4" color="textSecondary" component="p">
                            Caja 1
                        </Typography>
                    </CardContent>
                    <CardHeader
                        avatar={
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            variant="dot"
                          >
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                          </StyledBadge>
                        }
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                    />
                    <CardActions disableSpacing>
                        <Typography style={{fontWeight: 'bold'}} variant="h6" color="textSecondary" component="p">
                           Total actual: 
                        </Typography>
                        <Typography style={{margin: '0px 10px', color: 'green'}} variant="h6" color="textSecondary" component="p">
                             $22,300
                        </Typography>
                    </CardActions>
                </Card>
        </div>
    )
}
