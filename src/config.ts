// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const prodDomains = [
    'trackingtarkov.com',
];

const dev = prodDomains.includes(window.location.hostname);

const firebaseConfig = {
    apiKey: 'AIzaSyA_G-8ob1XuK2Qh5kHYEJy-KLHxX5nmZSE',
    authDomain: 'trackingtarkov.com',
    databaseURL: 'https://trackingtarkov-default-rtdb.firebaseio.com',
    projectId: 'trackingtarkov',
    storageBucket: 'trackingtarkov.appspot.com',
    messagingSenderId: '837586739602',
    appId: '1:837586739602:web:a192ffe13495ba3560e14b',
    measurementId: 'G-0W9GBECEW5',
};

const firebaseConfigDev = {
    apiKey: 'AIzaSyAqBmd9YxhSJmbiixcv0Z1puAy1W4yPHsQ',
    authDomain: 'trackingtarkovdev.firebaseapp.com',
    databaseURL: 'https://trackingtarkovdev-default-rtdb.firebaseio.com/',
    projectId: 'trackingtarkovdev',
    storageBucket: 'trackingtarkovdev.appspot.com',
    messagingSenderId: '884125177564',
    appId: '1:884125177564:web:2f5cb8a42b27b033b9c619',
    measurementId: 'G-GVYEVRQ0S4',
};

export const config = dev ? firebaseConfigDev : firebaseConfig;
