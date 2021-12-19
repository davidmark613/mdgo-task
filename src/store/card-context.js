import React from 'react';

const CardContext = React.createContext({
    items: [],
    setItems: (items) => {},
    changeItem: (item) => {},
    getId: (id) => {},
    addImage: (photo) => {},
    removeImage: (id) => {},
});

export default CardContext;