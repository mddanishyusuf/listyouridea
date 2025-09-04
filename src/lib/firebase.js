import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAQ3h5DV7rqxTUlECBU23tPJNCvLNteqEQ',
    authDomain: 'listyouridea.firebaseapp.com',
    projectId: 'listyouridea',
    storageBucket: 'listyouridea.firebasestorage.app',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
