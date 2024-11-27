import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, doc, setDoc, getDocs } from 'firebase/firestore';

// Función para obtener menú de la base de datos
const obtainOrders = async () => {
    try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { orders: ordersList, error: null };
    } catch (error) {
        return { orders: null, error: error.message };
    }
}

const obtainMenu = async () => {
    try {
        const menuCollection = collection(db, 'menu');
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { menu: menuList, error: null };
    } catch (error) {
        return { menu: null, error: error.message };
    }
}

const obtainTables = async () => {
    try {
        const tablesCollection = collection(db, 'tables');
        const tablesSnapshot = await getDocs(tablesCollection);
        const tablesList = tablesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { tables: tablesList, error: null };
    } catch (error) {
        return { tables: null, error: error.message };
    }
}


export { obtainOrders, obtainMenu, obtainTables };
