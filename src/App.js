import {Fragment, useEffect, useState, useContext, useCallback} from "react";
import CardList from './components/CardList';
import FormComponent from "./components/FormComponent";
import CardContext from './store/card-context';
import {CircularProgress} from "@mui/material";
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles({
    notifications: {
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
       height: '40rem'
   }
});

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const {setItems, items} = useContext(CardContext);

    const classes = useStyles();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('https://jsonplaceholder.typicode.com/photos');

            if (!response.ok) {
                throw new Error('Request failed! Could not fetch data!')
            }

            const loadedData = await response.json();
            setItems(loadedData);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [setItems]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);

    if (isLoading) {
        return (
            <div className={classes.notifications}>
                <CircularProgress/>
            </div>
        )
    }

    return (
        <Fragment>
            {isOpen && <FormComponent open={isOpen} onClose={closeModal}/>}
            {!isLoading && <CardList onOpenModal={openModal} items={items}/>}
            {error && <div className={classes.notifications}>{error.message}</div>}
        </Fragment>
    );
};

export default App;
