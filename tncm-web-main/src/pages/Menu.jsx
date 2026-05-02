import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

const MenuSkeleton = () => (
    <div className="grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="product-card skeleton-card" style={{ border: 'none' }}>
                <div className="skeleton skeleton-img"></div>
                <div className="product-info">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-price"></div>
                    <div className="skeleton skeleton-btn"></div>
                </div>
            </div>
        ))}
    </div>
);

const Menu = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);


    const { addToCart, updateQuantity, cartItems } = useCart();

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);

        // Fetch Categories
        const qCats = query(collection(db, "categories"), orderBy("pos"));
        const unsubscribeCats = onSnapshot(qCats, (snapshot) => {
            const catData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(catData);
        });

        // Fetch Products
        const qProducts = query(collection(db, "menu"), orderBy("id"));
        const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
            const productData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productData);
            setLoading(false);
        });

        return () => {
            unsubscribeCats();
            unsubscribeProducts();
        };
    }, []);

    useEffect(() => {
        const cat = searchParams.get('cat') || 'all';
        setActiveCategory(cat);
    }, [searchParams]);

    const handleFilter = (slug) => {
        setSearchParams({ cat: slug });
        setShowAll(false);
    };

    const getItemQty = (productId) => {
        const item = cartItems.find(i => i.id === productId);
        return item ? item.qty : 0;
    };

    const filteredBySearch = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.cat?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const allFiltered = useMemo(() => {
        const filtered = activeCategory === 'all'
            ? filteredBySearch
            : filteredBySearch.filter(p => p.cat === activeCategory);
        
        return filtered;
    }, [filteredBySearch, activeCategory]);


    const isLimited = activeCategory === 'all' && !showAll && allFiltered.length > 5;
    const finalDisplayProducts = isLimited ? allFiltered.slice(0, 5) : allFiltered;

    return (
        <div className="menu-page">
            <SEO
                title="Premium Gourmet Menu | nuttychocomorsels"
                description="Experience luxury in every bite. Browse our collection of signature brownies, viral Dubai chocolates, artisanal cheesecakes, and fresh-baked cookies."
                keywords="premium bakery menu, artisan brownies, Dubai style chocolate Gandhinagar"
            />
            
            {/* Unified Search & Filter Header */}
            <div className="search-filter-container" style={{ 
                position: 'relative', 
                padding: '20px 0',
                borderBottom: '1px solid #f0f0f0',
                marginBottom: '30px'
            }}>

                <div className="search-container" style={{ margin: '0 auto', maxWidth: '800px', padding: '0 15px' }}>
                    <div className="search-input-wrap" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '5px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <i className="fas fa-search" style={{ color: '#999', marginRight: '10px' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search for brownies, cheesecakes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: '1rem', outline: 'none' }}
                        />
                        
                        {/* Integrated Filter Toggle */}
                        <div style={{ width: '1px', height: '24px', background: '#eee', margin: '0 15px' }}></div>
                        <button 
                            className={`filter-toggle-btn ${showFilterPanel ? 'active' : ''} ${activeCategory !== 'all' ? 'has-active' : ''}`}
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: activeCategory !== 'all' ? 'var(--primary)' : '#333',
                                fontWeight: activeCategory !== 'all' ? '600' : '400'
                            }}
                        >
                            <i className="fas fa-sliders-h"></i>
                            <span className="hide-on-mobile">
                                {activeCategory !== 'all' ? (categories.find(c => c.slug === activeCategory)?.name || 'Filter') : 'Filter'}
                            </span>
                            <i className={`fas fa-chevron-${showFilterPanel ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilterPanel && (
                        <motion.div 
                            className="filter-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', background: '#fff' }}
                        >
                            <div style={{ padding: '20px 5%', maxWidth: '800px', margin: '0 auto' }}>
                                <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Categories</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <button
                                        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                                        onClick={() => {handleFilter('all'); setShowAll(false); setShowFilterPanel(false);}}
                                    >
                                        All Delights
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                                            onClick={() => {handleFilter(cat.slug); setShowFilterPanel(false);}}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>





            <div className="menu-container" style={{ paddingBottom: '50px' }}>
                {loading ? (
                    <MenuSkeleton />
                ) : finalDisplayProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                        <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.2 }}></i>
                        <p style={{ fontSize: '1.2rem' }}>Oops! We couldn't find what you're looking for.</p>
                        <button onClick={() => {setSearchQuery(''); setActiveCategory('all')}} style={{ marginTop: '15px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold' }}>Clear all filters</button>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + searchQuery + showAll}
                            className="menu-grid-container"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {finalDisplayProducts.map(product => {
                                const qty = getItemQty(product.id);
                                const imgUrl = product.image && product.image.length > 5
                                    ? product.image
                                    : `https://placehold.co/600x400/6b0f1a/ffffff?text=${product.name.replace(/ /g, '+')}`;

                                // Mock data for Zomato feel
                                const rating = (4 + (product.id % 10) / 10).toFixed(1);
                                const time = 20 + (product.id % 20);

                                return (
                                    <motion.div
                                        key={product.id}
                                        className="product-card"
                                        variants={cardVariants}
                                    >
                                        <div className="product-img-wrap">
                                            <img src={imgUrl} alt={product.name} loading="lazy" />
                                        </div>

                                        <div className="product-info">
                                            <div className="info-header">
                                                <h3 className="product-title">{product.name}</h3>
                                            </div>
                                            
                                            <div className="info-row" style={{ marginTop: '5px' }}>
                                                <div className="product-price" style={{ fontSize: '1.2rem', marginBottom: 0 }}>₹{product.price}</div>
                                                
                                                <div className="action-container">
                                                    {product.inStock === false ? (
                                                        <span style={{ color: '#999', fontWeight: '600', fontSize: '0.9rem' }}>Sold Out</span>
                                                    ) : qty === 0 ? (
                                                        <button
                                                            className="action-btn"
                                                            style={{ padding: '8px 15px', borderRadius: '10px' }}
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    ) : (
                                                        <div className="qty-control" style={{ borderRadius: '10px' }}>
                                                            <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                                                            <span>{qty}</span>
                                                            <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}

                {isLimited && (
                    <motion.div 
                        className="view-all-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ marginTop: '30px', paddingBottom: '20px' }}
                    >
                        <button 
                            className="view-all-btn" 
                            onClick={() => setShowAll(true)}
                            style={{ 
                                background: 'var(--primary)', 
                                color: 'white', 
                                border: 'none',
                                padding: '12px 25px',
                                fontSize: '0.95rem',
                                letterSpacing: '0.5px',
                                whiteSpace: 'nowrap',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            Explore Premium Collection <i className="fas fa-crown" style={{ color: '#ffd700' }}></i>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Menu;