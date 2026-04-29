import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditingSidebarName, setIsEditingSidebarName] = useState(false);
    
    const [profileData, setProfileData] = useState({
        displayName: '', 
        shippingName: '', 
        phone: '',
        street: '',
        city: '',
        taluka: '',
        district: '',
        state: '',
        pincode: '',
        landmark: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchProfile(currentUser.uid, currentUser);
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchProfile = async (uid, currentUser) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    ...data,
                    displayName: data.displayName || currentUser.displayName || '',
                    shippingName: data.shippingName || data.name || currentUser.displayName || '', 
                    email: data.email || currentUser.email || ''
                });
            } else {
                setProfileData(prev => ({
                    ...prev,
                    displayName: currentUser.displayName || '',
                    shippingName: currentUser.displayName || '',
                    email: currentUser.email || ''
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfileName = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                displayName: profileData.displayName,
                updatedAt: new Date()
            }, { merge: true });

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: profileData.displayName
                });
            }

            window.dispatchEvent(new Event('userProfileUpdated'));
            setIsEditingSidebarName(false);
            alert("Profile name updated!");
        } catch (error) {
            console.error("Error saving profile name:", error);
            alert("Failed to save profile name.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveShippingDetails = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                shippingName: profileData.shippingName,
                phone: profileData.phone,
                street: profileData.street,
                city: profileData.city,
                taluka: profileData.taluka,
                district: profileData.district,
                pincode: profileData.pincode,
                landmark: profileData.landmark,
                email: user.email,
                updatedAt: new Date()
            }, { merge: true });

            alert("Shipping details updated!");
        } catch (error) {
            console.error("Error saving shipping details:", error);
            alert("Failed to save shipping details.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#6b0f1a' }}></i>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page-container" style={styles.container}>
            <div style={styles.content}>
                <header style={styles.header}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", margin: 0, color: '#6b0f1a' }}>My Settings</h1>
                </header>

                <div className="profile-card-inner" style={styles.profileCard}>
                    <div className="profile-sidebar" style={styles.sidebar}>
                        <div className="profile-avatar-circle" style={styles.avatarCircle}>
                            {(profileData.displayName || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="profile-user-info" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                            {isEditingSidebarName ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                    <input 
                                        type="text" 
                                        value={profileData.displayName} 
                                        onChange={e => setProfileData({...profileData, displayName: e.target.value})}
                                        style={{...styles.input, textAlign: 'center', width: '80%'}}
                                        autoFocus
                                    />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={handleSaveProfileName} style={styles.miniBtnSave}>Save</button>
                                        <button onClick={() => setIsEditingSidebarName(false)} style={styles.miniBtnCancel}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-name-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>
                                        {profileData.displayName || user.displayName || 'Set Name'}
                                    </h2>
                                    <i 
                                        className="fa-solid fa-pen" 
                                        style={styles.editIcon} 
                                        onClick={() => setIsEditingSidebarName(true)}
                                        title="Edit Profile Name"
                                    ></i>
                                </div>
                            )}
                            <p style={{ margin: '8px 0', color: '#666', fontSize: '0.85rem' }}>{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-main-form" style={styles.mainForm}>
                        <form onSubmit={handleSaveShippingDetails}>
                            <h3 style={styles.sectionTitle}>
                                <i className="fa-solid fa-truck-fast"></i> Shipping Information
                            </h3>
                            <div className="profile-form-grid" style={styles.formGrid}>
                                <div className="profile-full-width" style={{...styles.inputGroup, gridColumn: 'span 2'}}>
                                    <label style={styles.label}>Full Name (For Delivery)</label>
                                    <input 
                                        type="text" 
                                        value={profileData.shippingName} 
                                        onChange={e => setProfileData({...profileData, shippingName: e.target.value})}
                                        style={styles.input}
                                        placeholder="Enter full name for shipping"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={profileData.phone} 
                                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                                        style={styles.input}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Pincode</label>
                                    <input 
                                        type="text" 
                                        value={profileData.pincode} 
                                        onChange={e => setProfileData({...profileData, pincode: e.target.value})}
                                        style={styles.input}
                                        maxLength="6"
                                    />
                                </div>
                                <div className="profile-full-width" style={{...styles.inputGroup, gridColumn: 'span 2'}}>
                                    <label style={styles.label}>Street Address / Building</label>
                                    <input 
                                        type="text" 
                                        value={profileData.street} 
                                        onChange={e => setProfileData({...profileData, street: e.target.value})}
                                        style={styles.input}
                                        placeholder="House No. / Building / Street Name"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>City</label>
                                    <input 
                                        type="text" 
                                        value={profileData.city} 
                                        onChange={e => setProfileData({...profileData, city: e.target.value})}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Taluka</label>
                                    <input 
                                        type="text" 
                                        value={profileData.taluka} 
                                        onChange={e => setProfileData({...profileData, taluka: e.target.value})}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>District</label>
                                    <input 
                                        type="text" 
                                        value={profileData.district} 
                                        onChange={e => setProfileData({...profileData, district: e.target.value})}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Landmark (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={profileData.landmark} 
                                        onChange={e => setProfileData({...profileData, landmark: e.target.value})}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={saving}
                                style={styles.saveBtn}
                            >
                                {saving ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-save"></i> Update Shipping Details
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 5%',
        background: '#fcf8f8',
        minHeight: '80vh'
    },
    content: {
        maxWidth: '900px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '30px',
        textAlign: 'left'
    },
    profileCard: {
        display: 'flex',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
    },
    sidebar: {
        flex: '0 0 280px',
        background: '#fdfdfd',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid #eee'
    },
    avatarCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        fontWeight: 'bold',
        boxShadow: '0 8px 25px rgba(107, 15, 26, 0.2)',
        transition: '0.3s'
    },
    editIcon: {
        fontSize: '0.9rem',
        color: '#999',
        cursor: 'pointer',
        transition: '0.2s'
    },
    miniBtnSave: {
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        padding: '5px 12px',
        borderRadius: '15px',
        fontSize: '0.75rem',
        cursor: 'pointer'
    },
    miniBtnCancel: {
        background: '#eee',
        color: '#666',
        border: 'none',
        padding: '5px 12px',
        borderRadius: '15px',
        fontSize: '0.75rem',
        cursor: 'pointer'
    },
    mainForm: {
        flex: 1,
        padding: '40px'
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#6b0f1a',
        marginBottom: '25px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#777',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #eee',
        fontSize: '0.95rem',
        background: '#fcfcfc',
        transition: '0.3s',
        outline: 'none'
    },
    saveBtn: {
        marginTop: '30px',
        width: '100%',
        background: 'var(--primary)',
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(107, 15, 26, 0.2)',
        transition: '0.3s'
    }
};

export default Profile;
