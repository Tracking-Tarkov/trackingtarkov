import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseConfig, firebaseConfigDev, dev } from "../config";

const firebaseApp = dev
    ? initializeApp(firebaseConfigDev)
    : initializeApp(firebaseConfig);

export const database = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();
/* Authenticaiton  */

export const signIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            const user = result.user;

            update(ref(database, "users/" + user.uid), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                creationTime: user.metadata.creationTime,
            });
        })
        .catch(() => {});
};

/* Databse calls */

export interface IRealtimeAPICall {
    data: any;
    error: any;
}

export const basicRealtimeApiCall = async (
    path: string
): Promise<IRealtimeAPICall> => {
    let data;
    let error;
    await get(ref(database, path))
        .then((snapshot) => {
            data = snapshot.exists() ? snapshot.val() : null;
        })
        .catch((e) => {
            error = e;
        });
    return { data, error };
};
