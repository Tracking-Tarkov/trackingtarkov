import { Alert, Snackbar } from '@mui/material';
import _ from 'lodash';
import React, { createContext, useContext, useState } from 'react';

type TSnackbarContext = {
    addMessage: (key: string, val: string) => void;
}

const snackbarContext = createContext<TSnackbarContext>({
    addMessage: () => {
        throw new Error('Not implemented');
    }
});

const Provider = snackbarContext.Provider;

export const SnackbarProvider = ({ children }: React.PropsWithChildren) => {
    const [messages, setMessages] = useState<Record<string, { message: string, open: boolean }>>({});

    const addMessage = (key: string, value: string) => {
        setMessages({ [key]: { message: value, open: true }, ...messages, });
    };

    const closeMessage = (key: string) => {
        const updated = { ...messages };
        _.set(updated, `${key}.open`, false);
        setMessages(updated);
    };

    return (
        <Provider
            value={{ addMessage }}
        >
            {children}
            {Object.entries(messages).map(([k, v]) => {
                console.log(v);
                return <Snackbar
                    key={k}
                    autoHideDuration={5000}
                    open={v.open}
                    transitionDuration={600}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    onClose={(e, reason) => {
                        if (reason === 'timeout') closeMessage(k);
                    }}
                >
                    <Alert variant='filled' severity='warning' onClose={() => closeMessage(k)}>
                        {v.message}
                    </Alert>
                </Snackbar>;
            }
            )}
        </Provider>
    );
};

export const useSnackbar = () => {
    return useContext(snackbarContext);
};
