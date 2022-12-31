/** @module scraper */
import admin, { ServiceAccount } from "firebase-admin";
import {
    firebaseConfig,
    firebaseConfigDev,
    adminConfig,
    adminConfigDev,
    dev,
} from "../src/config.js";
import { updateTraderData } from "./traderScraper.js";

const devFirevaseServiceAccount = adminConfigDev as ServiceAccount;
const fireBaseserviceAccount = adminConfig as ServiceAccount;

if (dev) {
    admin.initializeApp({
        credential: admin.credential.cert(devFirevaseServiceAccount),
        databaseURL: firebaseConfigDev.databaseURL,
    });
} else {
    admin.initializeApp({
        credential: admin.credential.cert(fireBaseserviceAccount),
        databaseURL: firebaseConfig.databaseURL,
    });
}
const database = admin.database();

// Call this for updating trader quest data
await updateTraderData(database);

//Call this for updating ammo chart data
// await updateAmmoChart(database);

admin.app().delete();
