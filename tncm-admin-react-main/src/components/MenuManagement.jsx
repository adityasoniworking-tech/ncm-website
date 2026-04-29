import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    setDoc,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';

const defaultItems = [
    { id: 1, name: "Classic chocolate brownie", price: 79, cat: "brownie", inStock: true, image: "https://bkmedia.bakingo.com/heavenly-choco-brownie-brow2948choc-AA.jpg" },
    { id: 2, name: "Walnut brownie", price: 89, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2" },
    { id: 3, name: "Nuts brownie", price: 99, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1589218436045-ee320057f443" },
    { id: 4, name: "Salted caramel brownie", price: 99, cat: "brownie", inStock: true, image: "https://bromabakery.com/wp-content/uploads/2014/11/scbrownie3-1067x1600.jpg" },
    { id: 5, name: "Marbled brownie", price: 109, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e" },
    { id: 6, name: "Expresso / Mocha brownie", price: 119, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2" },
    { id: 7, name: "Hazel-Nutella brownie", price: 139, cat: "brownie", inStock: true, image: "https://www.thedessertsymphony.in/cdn/shop/files/IMG-20230906-WA0000_1.jpg" },
    { id: 8, name: "Lotus-Biscoff brownie", price: 159, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2" },
    { id: 9, name: "Pistachio-Kunafa brownie", price: 159, cat: "brownie", inStock: true, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e" },
    { id: 10, name: "Classic cheesecake", price: 119, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Classic%20cheesecake.png" },
    { id: 11, name: "Mango cheesecake", price: 129, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Mango%20cheesecake.png" },
    { id: 12, name: "Strawberry cheesecake", price: 129, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Strawberry%20cheesecake.png" },
    { id: 13, name: "Blueberry cheesecake", price: 139, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Blueberry%20cheesecake.png" },
    { id: 14, name: "Chocolate cheesecake", price: 139, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Chocolate%20cheesecake.png" },
    { id: 15, name: "Salted caramel cheesecake", price: 149, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Salted%20caramel%20cheesecake.png" },
    { id: 16, name: "Nutella cheesecake", price: 179, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Nutella%20cheesecake.png" },
    { id: 17, name: "Lotus-Biscoff cheesecake", price: 189, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Lotus-Biscoff%20cheesecake.png" },
    { id: 18, name: "Dubai Pistachio-Kunafa", price: 199, cat: "cheesecake", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/cheescake/Dubai%20Pistachio-Kunafa.png" },
    { id: 19, name: "Rose & cardamom", price: 39, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Rose%20&%20cardamom.png" },
    { id: 20, name: "Choco-chip", price: 59, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Choco-chip.png" },
    { id: 21, name: "Blueberry", price: 59, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Blueberry.png" },
    { id: 22, name: "Chocolate w/ ganache", price: 79, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Chocolate%20w%20ganache.png" },
    { id: 23, name: "Nutella", price: 89, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Nutella.png" },
    { id: 24, name: "Biscoff", price: 109, cat: "muffin", inStock: true, image: "https://ik.imagekit.io/afg8v0ied/muffin/Biscoff.png" },
    { id: 25, name: "Blueberry cookie", price: 69, cat: "cookie", inStock: true, image: "https://ik.imagekit.io/ngavkj1dy/Blueberry%20cookie.png" },
    { id: 26, name: "Dark choco-chips", price: 69, cat: "cookie", inStock: true, image: "https://wholesomepatiscilla.com/wp-content/uploads/2021/07/Bakery-Style-Dark-Chocolate-Chip-Cookies-Featured-Image.jpg" },
    { id: 27, name: "Salted caramel", price: 69, cat: "cookie", inStock: true, image: "https://ik.imagekit.io/ngavkj1dy/cookie%20Salted%20caramel.png" },
    { id: 28, name: "Red velvet & white choco", price: 69, cat: "cookie", inStock: true, image: "https://houseofnasheats.com/wp-content/uploads/2019/01/Red-Velvet-White-Chocolate-Chip-Cookies-9.jpg" },
    { id: 29, name: "Almond chocolate", price: 79, cat: "cookie", inStock: true, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35" },
    { id: 30, name: "Cashew cookie", price: 79, cat: "cookie", inStock: true, image: "https://ik.imagekit.io/ngavkj1dy/Cashew%20cookie.png" },
    { id: 31, name: "Hazel-Nutella", price: 89, cat: "cookie", inStock: true, image: "https://i.ytimg.com/vi/5Is9bp691EM/hq720.jpg" },
    { id: 32, name: "Pistachio & choco-chip", price: 89, cat: "cookie", inStock: true, image: "https://ik.imagekit.io/ngavkj1dy/Pistachio%20&%20choco-chip.png" },
    { id: 33, name: "Classic butter (10 pc)", price: 99, cat: "cookie", inStock: true, image: "https://brownsbakery.in/cdn/shop/files/custom_resized_1733fe50-2a75-479a-bf0a-8a1c2113b1ff.jpg" },
    { id: 34, name: "Kunafa bites (25 gm)", price: 49, cat: "chocolate", inStock: true, image: "https://ik.imagekit.io/auwbv7fp3/Kunafa%20bites%20(25%20gm).png" },
    { id: 35, name: "Dark Choco Pistachio-Kunafa", price: 349, cat: "chocolate", inStock: true, image: "https://ik.imagekit.io/auwbv7fp3/chocolate%20%20Dark%20Choco%20Pistachio-Kunafa.png" }
];

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', price: '', cat: '', image: '' });
    const [newCategory, setNewCategory] = useState({ name: '', pos: 0 });
    const [isAddProductVisible, setIsAddProductVisible] = useState(false);
    const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
    const [isInventoryVisible, setIsInventoryVisible] = useState(true);

    useEffect(() => {
        const menuQuery = query(collection(db, 'menu'), orderBy('id'));
        const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setMenuItems(items);
            setLoading(false);
        });

        const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const cats = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setCategories(cats);
        });

        return () => {
            unsubscribeMenu();
            unsubscribeCategories();
        };
    }, []);

    const handleUpdateItem = async (docId, updates) => {
        try {
            const itemRef = doc(db, 'menu', docId);
            await updateDoc(itemRef, updates);
            alert('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Update failed: ' + error.message);
        }
    };

    const handleDeleteItem = async (docId, itemName) => {
        if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
            try {
                await deleteDoc(doc(db, 'menu', docId));
                alert('Item deleted.');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Delete failed.');
            }
        }
    };

    const handleAddNewItem = async () => {
        if (!newItem.name || !newItem.price || !newItem.cat || !newItem.image) {
            return alert('Please fill all fields!');
        }

        try {
            const nextId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
            await setDoc(doc(db, 'menu', String(nextId)), {
                ...newItem,
                id: nextId,
                price: Number(newItem.price),
                inStock: true
            });
            setNewItem({ name: '', price: '', cat: '', image: '' });
            alert('Product added!');
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add product.');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name) return alert('Enter category name!');
        const slug = newCategory.name.toLowerCase().replace(/ /g, '-');
        try {
            await setDoc(doc(db, 'categories', slug), {
                name: newCategory.name,
                slug: slug,
                pos: Number(newCategory.pos)
            });
            setNewCategory({ name: '', pos: 0 });
            alert('Category added!');
        } catch (error) {
            alert('Category add failed.');
        }
    };

    const handleDeleteCategory = async (slug) => {
        if (confirm('Delete this category filter?')) {
            try {
                await deleteDoc(doc(db, 'categories', slug));
            } catch (error) {
                alert('Delete failed.');
            }
        }
    };

    const resetDefaultMenu = async () => {
        if (!confirm('This will RESET the menu to defaults. Continue?')) return;
        try {
            const snapshot = await getDocs(collection(db, 'menu'));
            const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);

            const uploadPromises = defaultItems.map(item =>
                setDoc(doc(db, 'menu', String(item.id)), item)
            );
            await Promise.all(uploadPromises);
            alert('Menu reset to defaults!');
        } catch (error) {
            alert('Reset failed.');
        }
    };

    const filteredItems = menuItems.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id && String(item.id).includes(searchTerm))
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-12">

            {/* 1. Category Manager */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => setIsCategoryManagerVisible(!isCategoryManagerVisible)}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-tags"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">1. Manage Categories</h3>
                    </div>
                    <i className={`fa-solid fa-chevron-down transition-transform ${isCategoryManagerVisible ? 'rotate-180' : ''}`}></i>
                </button>

                {isCategoryManagerVisible && (
                    <div className="p-6 border-t border-gray-50 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <div key={cat.docId} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm font-medium text-gray-700">
                                    {cat.name}
                                    <button onClick={() => handleDeleteCategory(cat.docId)} className="text-red-400 hover:text-red-600">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                                type="text" placeholder="Category Name"
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Position (0, 1...)"
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                                value={newCategory.pos}
                                onChange={e => setNewCategory({ ...newCategory, pos: e.target.value })}
                            />
                            <button onClick={handleAddCategory} className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-600/20">Add Category</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Add Product */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => setIsAddProductVisible(!isAddProductVisible)}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">2. Add New Product</h3>
                    </div>
                    <i className={`fa-solid fa-chevron-down transition-transform ${isAddProductVisible ? 'rotate-180' : ''}`}></i>
                </button>

                {isAddProductVisible && (
                    <div className="p-6 border-t border-gray-50 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text" placeholder="Product Name"
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Price (₹)"
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                value={newItem.price}
                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                            />
                            <select
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                value={newItem.cat}
                                onChange={e => setNewItem({ ...newItem, cat: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.docId} value={cat.slug}>{cat.name}</option>)}
                            </select>
                            <input
                                type="text" placeholder="Image Link (URL)"
                                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                value={newItem.image}
                                onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                            />
                        </div>
                        <button onClick={handleAddNewItem} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 w-full sm:w-auto">Save Product</button>
                    </div>
                )}
            </div>

            {/* 3. Inventory Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <button
                        onClick={() => setIsInventoryVisible(!isInventoryVisible)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-boxes-stacked"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 tracking-tight">3. Live Menu Inventory</h3>
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full md:w-80">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={resetDefaultMenu}
                                className="flex-grow md:flex-initial text-xs font-bold bg-amber-100 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200 transition whitespace-nowrap"
                            >
                                Reset Default Menu
                            </button>
                            <button
                                onClick={() => setIsInventoryVisible(!isInventoryVisible)}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <i className={`fa-solid fa-chevron-down transition-transform text-gray-400 ${isInventoryVisible ? 'rotate-180' : ''}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {isInventoryVisible && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4">Item Details</th>
                                    <th className="px-6 py-4">Price (₹)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Image Reference</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-12 text-gray-400 font-medium">Loading inventory...</td></tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-12 text-gray-400 font-medium">No items found.</td></tr>
                                ) : (
                                    filteredItems.map(item => (
                                        <tr key={item.docId} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: {item.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2 border border-gray-100 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-400 outline-none"
                                                    defaultValue={item.price}
                                                    id={`price-${item.docId}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    className={`text-xs font-bold px-3 py-2 rounded-lg border border-gray-100 outline-none focus:ring-2 focus:ring-blue-400 ${item.inStock ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                                                    defaultValue={String(item.inStock)}
                                                    id={`stock-${item.docId}`}
                                                >
                                                    <option value="true">IN STOCK</option>
                                                    <option value="false">OUT OF STOCK</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        className="flex-grow min-w-[150px] p-2 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400"
                                                        defaultValue={item.image}
                                                        id={`img-${item.docId}`}
                                                    />
                                                    {item.image && (
                                                        <a href={item.image} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                                            <i className="fa-solid fa-eye text-xs"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateItem(item.docId, {
                                                            price: Number(document.getElementById(`price-${item.docId}`).value),
                                                            inStock: document.getElementById(`stock-${item.docId}`).value === 'true',
                                                            image: document.getElementById(`img-${item.docId}`).value
                                                        })}
                                                        className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        UPDATE
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.docId, item.name)}
                                                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <i className="fa-solid fa-trash-can text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManagement;
