import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
const auth = getAuth();

//Menu CRUD
// --------------------------------------------------------------------------------------------
// Función para obtener menú de la base de datos
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

const createMenuItem = async (item) => {
    try {
        const menuCollection = collection(db, 'menu');
        const newMenuItem = await addDoc(menuCollection, item);
        return { id: newMenuItem.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
}

const updateItem = async (item) => {
    try {
        const itemDoc = doc(db, 'menu', item.id);
        await setDoc(itemDoc, item);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
}

const deleteItem = async (itemId) => {
    try {
        const itemDoc = doc(db, 'menu', itemId);
        await deleteDoc(itemDoc);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
}

const availableItems = async (itemId, state = true) => {
    try {
        const itemDoc = doc(db, 'menu', itemId);
        await updateDoc(itemDoc, { available: state });
        return { error: null, state: state };
    } catch (error) {
        return { error: error.message };
    }
}
//--------------------------------------------------------------------------------------------

//Tables CRUD
//--------------------------------------------------------------------------------------------
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

const createTable = async (table) => {
    try {
        const tablesCollection = collection(db, 'tables');
        const newTable = await addDoc(tablesCollection, table);
        return { id: newTable.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
}

const tableStatus = async (tableId, status) => {
    try {
        const tableDoc = doc(db, 'tables', tableId);
        await updateDoc(tableDoc, { status: status });
        return { error: null, status: status };
    } catch (error) {
        return { error: error.message };
    }
}

//--------------------------------------------------------------------------------------------

//Orders CRUD
//--------------------------------------------------------------------------------------------

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

//--------------------------------------------------------------------------------------------

//Users CRUD
//--------------------------------------------------------------------------------------------
const createUser = async (email, password, name) => {
    try {
        // Crear el usuario con correo y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Obtener el usuario creado
        const user = userCredential.user;

        // Guardar datos adicionales del usuario en Firestore usando el UID como ID del documento
        await setDoc(doc(db, 'Users', user.uid), {
            role: 'kitchen',
            email: email,
            name: name,
            created: new Date(),
        });

        console.log('Usuario creado correctamente:', user.uid);
        return user;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

const obtainKitchenUsers = async () => {
    try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);

        // Filtrar los usuarios cuyo rol sea 'kitchen'
        const kitchenUsers = usersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.role === 'kitchen'); // Filtramos solo los de "kitchen"

        return { users: kitchenUsers, error: null };
    } catch (error) {
        return { users: null, error: error.message };
    }
}

//--------------------------------------------------------------------------------------------

//Categories CRUD
const obtainCategories = async () => {
    try {
        const categoriesCollection = collection(db, 'menuCategories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { categories: categoriesList, error: null };
    } catch (error) {
        return { categories: null, error: error.message };
    }
}

export { obtainMenu, obtainTables, obtainCategories, createMenuItem, updateItem, deleteItem, availableItems, createTable, tableStatus, obtainOrders, createUser, obtainKitchenUsers };