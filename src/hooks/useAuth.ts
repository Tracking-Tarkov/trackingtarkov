import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import { useSearchParams } from 'react-router-dom';

export const useAuth = () => {
    const [user] = useAuthState(auth);
    const [params, setSearchParams] = useSearchParams();

    const viewAs = params.get('viewAs') ?? user?.uid;

    const readOnly = viewAs !== user?.uid;

    const cancelViewAs = () => {
        const newParams = params;
        params.delete('viewAs');
        setSearchParams(newParams);
    };

    return { viewAs, readOnly, user, cancelViewAs };
};
