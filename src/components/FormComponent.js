import React, {useRef, useState, useContext, useEffect, useCallback} from 'react';
import {FormControl, Input, InputLabel, Modal, Box, Button} from '@mui/material';
import useInput from '../hooks/use-input';
import {makeStyles} from '@mui/styles';
import CardContext from '../store/card-context';

const isNotEmpty = value => value.trim().length > 0;
const validId = (value, id) => value === id;
const validUrl = value => {
    const pattern = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s?#]+\.?)+(\/[^\s]*)?$/i);
    return !!pattern.test(value);
};

const useStyles = makeStyles({
    formWrapper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        padding: '2rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
    },
    photoActions: {
        display: 'flex',
        gap: '0.5rem'
    },
    errorMessage: {
        color: 'rgba(211,30,30,0.6)',
        fontWeight: '400',
        fontSize: '0.75rem',
        lineHeight: '1.66',
        letterSpacing: '0.03333em',
        textAlign: 'left',
        margin: '3px 14px 0 14px',
    }
});

const FormComponent = (props) => {
    const [selectedFile, setSelectedFile] = useState('');
    const [titleError, setTitleError] = useState('');
    const [urlError, setUrlError] = useState('');
    const hiddenFileInputRef = useRef(null);
    const {changeItem, addImage, removeImage, itemId, items} = useContext(CardContext);

    const {
        value: id,
        valueIsValid: idIsValid,
        hasError: idHasError,
        valueChangeHandler: idChangeHandler,
        inputBlurHandler: idBlurHandler,
        reset: resetIdInput
    } = useInput(validId, itemId);

    const {
        value: title,
        valueIsValid: titleIsValid,
        hasError: titleHasError,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        reset: resetTitleInput
    } = useInput(isNotEmpty);

    const {
        value: url,
        valueIsValid: urlIsValid,
        hasError: urlHasError,
        valueChangeHandler: urlChangeHandler,
        inputBlurHandler: urlBlurHandler,
        reset: resetUrlInput
    } = useInput(validUrl);

    const classes = useStyles();

    const formIsValid = idIsValid && titleIsValid && urlIsValid;

    const validateUrl = useCallback((items, url) => {
        const isNotValid = items.some((item) => item.url.toLowerCase() === url.toLowerCase());
        if (isNotValid) {
            setUrlError('The same url already exist!');
        } else {
            setUrlError( '');
        }
    }, []);

    const validateTitle = useCallback((items, title) => {
        const isNotValid = items.some((item) => item.title.toLowerCase() === title.toLowerCase());
        if (isNotValid) {
            setTitleError('The same title already exist!');
        } else {
            setTitleError('');
        }
    }, []);

    useEffect(() => {
        validateUrl(items, url);
    }, [items, url, validateUrl]);

    useEffect(() => {
        validateTitle(items, title);
    }, [items, title, validateTitle]);

    const addImageHandler = event => {
        hiddenFileInputRef.current.click();
    };

    const fileChangeHandler = event => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSelectedFile(imageUrl);
        addImage({itemId, imageUrl});
    };

    const removeImageHandler = () => {
        const item = items.find((item) => item.id === itemId);
        if (!item.fallback) {
            return;
        }

        removeImage({itemId});
        props.onClose();
    };

    const formSubmitHandler = event => {
        event.preventDefault();
        if (!formIsValid || titleError.length > 0 || urlError.length > 0) {
            return;
        }

        changeItem({title, url, imageUrl: selectedFile});
        props.onClose();
        resetIdInput();
        resetTitleInput();
        resetUrlInput();
    };

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box className={classes.formWrapper}>
                <form onSubmit={formSubmitHandler} className={classes.form}>
                    <FormControl>
                        <InputLabel htmlFor="id">Id</InputLabel>
                        <Input
                            id='id'
                            type='text'
                            value={id}
                            onChange={idChangeHandler}
                            onBlur={idBlurHandler}
                            error={idHasError}
                        />
                        {idHasError && <p className={classes.errorMessage}>{`Id can't be change. Current card has Id: ${itemId}`}</p>}
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input
                            id='title'
                            type='text'
                            value={title}
                            onChange={titleChangeHandler}
                            onBlur={titleBlurHandler}
                            error={titleHasError || !!titleError.message}
                        />
                        {titleHasError && <p className={classes.errorMessage}>Title should not be empty</p>}
                        {!titleHasError && titleError.trim().length > 0 && <p className={classes.errorMessage}>{titleError}</p>}
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="url">Url</InputLabel>
                        <Input
                            id='url'
                            type='text'
                            value={url || selectedFile}
                            onChange={urlChangeHandler}
                            onBlur={urlBlurHandler}
                            error={urlHasError || !!urlError.message}
                        />
                        {urlHasError && <p className={classes.errorMessage}>Please enter a valid URL</p>}
                        {!urlHasError && urlError.trim().length > 0 && <p className={classes.errorMessage}>{urlError}</p>}
                    </FormControl>
                    <div className={classes.actions}>
                        <div className={classes.photoActions}>
                            <input
                                type='file'
                                style={{display: 'none'}}
                                ref={hiddenFileInputRef}
                                onChange={fileChangeHandler}
                            />
                            <Button
                                size='small'
                                variant="outlined"
                                href="#outlined-buttons"
                                onClick={addImageHandler}
                            >
                                Add
                            </Button>
                            <Button
                                size='small'
                                variant="outlined"
                                color="error"
                                onClick={removeImageHandler}
                            >
                                Remove
                            </Button>
                        </div>
                        <div className={classes.modalActions}>
                            <Button type='submit'>Save</Button>
                            <Button type='button' onClick={props.onClose}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default FormComponent;