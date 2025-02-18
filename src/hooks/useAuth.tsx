import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, basicRealtimeApiCall } from '../utils/firebase';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from './useSnackbar';
import { User } from 'firebase/auth';

type TAuthContext = {
    user?: User | null,
    viewAs?: string | null,
    readOnly: boolean,
    cancelViewAs: () => void;
}

const authContext = createContext<TAuthContext>({
    user: null,
    viewAs: null,
    readOnly: true,
    cancelViewAs: () => {
        throw new Error('Not implemented');
    }
});

const Provider = authContext.Provider;

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [user] = useAuthState(auth);
    const [params, setSearchParams] = useSearchParams();
    const [viewAs, setViewAs] = useState<string | undefined>(undefined);
    const { addMessage } = useSnackbar();

    useEffect(() => {
        const viewAsParam = params.get('viewAs');
        if (!viewAsParam) {
            setViewAs(user?.uid);
            return;
        }
        basicRealtimeApiCall(`users/${viewAsParam}`).then(({ data, error }) => {
            if (data) {
                setViewAs(viewAsParam);
            } else {
                console.error('Failed to retrieve user', error);
                addMessage(viewAsParam, `Cannot view as unknown user ${viewAsParam}`);
            }
        });
    }, [params, user]);

    const value = useMemo(() => {
        const readOnly = viewAs !== user?.uid;

        const cancelViewAs = () => {
            params.delete('viewAs');
            setSearchParams(params);
        };
        return { user, viewAs, readOnly, cancelViewAs };
    }, [user, params, viewAs, setSearchParams]);

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

export const useAuth = () => {
    return useContext(authContext);
};
