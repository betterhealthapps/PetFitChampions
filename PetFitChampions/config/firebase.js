import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration (paste from Step 2)
const firebaseConfig = {
  apiKey: "AIzaSyCsyjjcyiCXd9TmaZdfWQSj9whvKzMHDXU",
  authDomain: "petfitchampions.firebaseapp.com",
  projectId: "petfitchampions",
  storageBucket: "petfitchampions.appspot.com",
  messagingSenderId: "434274586885",
  appId: "1:434274586885:web:945c05c94a7758b0ea276c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
