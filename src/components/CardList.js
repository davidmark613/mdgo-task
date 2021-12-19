import React, { useState } from "react";
import { Pagination, Box, Grid} from '@mui/material';
import {useContext} from 'react';
import CardItem from './CardItem';
import {makeStyles} from "@mui/styles";
import CardContext from '../store/card-context';
import usePagination from '../hooks/use-pagination';
import LazyLoad from 'react-lazyload';

const useStyles = makeStyles({
    itemsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '2rem 0'
    },
    gridContainer: {
        padding: '2rem 3rem'
    }
});

const CardList = (props) => {
    let [page, setPage] = useState(1);
    const {items} = useContext(CardContext);
    const {onOpenModal} = props;
    const classes = useStyles();

    const PER_PAGE = 30;

    const count = Math.ceil(items.length / PER_PAGE);
    const _DATA = usePagination(items, PER_PAGE);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    return (
        <Box p="5" className={classes.itemsWrapper}>
            <Pagination
                count={count}
                size="large"
                page={page}
                variant="outlined"
                shape="rounded"
                onChange={handleChange}
            />
            <Grid container spacing={4} className={classes.gridContainer}>
                {_DATA.currentData().map((item) => (
                    <Grid item key={item.id} xs={12} sm={6} md={4}>
                        <LazyLoad height='20rem' once>
                            <CardItem
                                id={item.id}
                                title={item.title}
                                url={item.url}
                                image={item.thumbnailUrl}
                                onOpen={onOpenModal}
                            />
                        </LazyLoad>
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={count}
                size="large"
                page={page}
                variant="outlined"
                shape="rounded"
                onChange={handleChange}
            />
        </Box>
    );
};

export default CardList;