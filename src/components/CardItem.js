import {useContext} from 'react';
import {Card, CardMedia, CardContent, CardActions, Button, Typography} from '@mui/material';
import {makeStyles} from "@mui/styles";
import CardContext from '../store/card-context';

const useStyles = makeStyles({
    cardItem: {
        maxWidth: '21rem',
        height: '20rem'
    },
    cardMedia: {
        height: '9rem'
    },
    cardContent: {

    },
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

const CardItem = (props) => {
    const {id, title, url, image, onOpen} = props;
    const {getId} = useContext(CardContext);
    const classes = useStyles();

    const modalOpenHandler = (itemId) => {
        getId(itemId);
        onOpen();
    };

    return (
        <Card className={classes.cardItem}>
            <CardMedia
                className={classes.cardMedia}
                component="img"
                alt={title}
                image={image}
            />
            <CardContent className={classes.cardContent}>
                <Typography variant="h7" color="text.secondary">{title}</Typography>
                <Typography variant="body2" color="text.secondary">Url: {url}</Typography>
                <Typography variant="body2" color='text.secondary'>Id: {id}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size="small" onClick={modalOpenHandler.bind(null, id)}>Edit</Button>
            </CardActions>
        </Card>
    );
}

export default CardItem;