import { initializeApp } from 'firebase/app';
import {
    getDatabase,
    ref,
    get,
    update
} from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { config } from '../config';

const firebaseApp = initializeApp(config);

export const database = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();
/* Authenticaiton  */

export const signIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            const user = result.user;

            update(ref(database, 'users/' + user.uid), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                creationTime: user.metadata.creationTime,
            });
        })
        .catch();
};

/* Databse calls */

export interface IRealtimeAPICall<T> {
    data: T | null;
    error?: Error;
}

export const basicRealtimeApiCall = async <T>(
    path: string
): Promise<IRealtimeAPICall<T>> => {
    let data: T | null = null;
    let error;
    await get(ref(database, path))
        .then((snapshot) => {
            data = snapshot.exists() ? snapshot.val() as T : null;
        })
        .catch((e) => {
            error = e;
        });
    return { data, error };
};
