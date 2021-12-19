import {useCallback, useReducer} from 'react';
import CardContext from "./card-context";

const defaultState = {
    items: [],
    itemId: 0
};

const cardReducer = (state, action) => {
    if (action.type === 'SET') {
        const loadedItems = action.payload;
        return {items: loadedItems, itemId: state.itemId};
    }

    if (action.type === 'CHANGE') {
        const {url, imageUrl, title} = action.payload;
        const existingItemIndex = state.items.findIndex((item) => item.id === state.itemId);
        const existingItem = state.items[existingItemIndex];
        let updatedItems;

        if (existingItem) {
            if (imageUrl) {
                const updatedItem = {
                    ...existingItem, title, thumbnailUrl: imageUrl
                }
                updatedItems = [...state.items];
                updatedItems[existingItemIndex] = updatedItem;
            } else {
                const fallback = {...existingItem};
                const updatedItem = {
                    ...existingItem, title, thumbnailUrl: url, url, fallback
                }
                updatedItems = [...state.items];
                updatedItems[existingItemIndex] = updatedItem;
            }
        }

        return { items: updatedItems, itemId: state.itemId };
    }

    if (action.type === 'GET_ID') {
        const id = action.payload;
        return {items: state.items, itemId: id}
    }

    if (action.type === 'ADD') {
        const {itemId, imageUrl} = action.payload;
        const existingItemIndex = state.items.findIndex((item) => item.id === itemId);
        const existingItem = state.items[existingItemIndex];
        let updatedItems;

        if (existingItem && !existingItem.fallback) {
            const fallback = {...existingItem};
            const updatedItem = {
                ...existingItem, fallback, url: imageUrl
            }
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = updatedItem;
        } else {
            const updatedItem = {
                ...existingItem, url: imageUrl
            }
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = updatedItem;
        }

        return { items: updatedItems, itemId: state.itemId }
    }

    if (action.type === 'REMOVE') {
        const {itemId} = action.payload;
        const existingItemIndex = state.items.findIndex((item) => item.id === itemId);
        const existingItem = state.items[existingItemIndex];
        let updatedItems;

        if (existingItem && existingItem.fallback) {
            const updatedItem = existingItem.fallback;
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = updatedItem;
        }

        return { items: updatedItems, itemId: state.itemId };
    }

    return defaultState;
};

const CardProvider = props => {
    const [cardState, dispatchCardAction] = useReducer(cardReducer, defaultState);

    const setItemsHandler = useCallback((items) => {
        dispatchCardAction({type: 'SET', payload: items});
    }, []);

    const changeItemHandler = item => {
        dispatchCardAction({type: 'CHANGE', payload: item});
    };

    const getItemId = id => {
        dispatchCardAction({type: 'GET_ID', payload: id});
    };

    const addImageHandler = imageUrl => {
      dispatchCardAction({type: 'ADD', payload: imageUrl});
    };

    const removeImageHandler = id => {
      dispatchCardAction({type: 'REMOVE', payload: id});
    };

    const cardsContext = {
        items: cardState.items,
        itemId: cardState.itemId,
        setItems: setItemsHandler,
        changeItem: changeItemHandler,
        getId: getItemId,
        addImage: addImageHandler,
        removeImage: removeImageHandler,
    };

    return (
        <CardContext.Provider value={cardsContext}>
            {props.children}
        </CardContext.Provider>
    );
};

export default CardProvider;