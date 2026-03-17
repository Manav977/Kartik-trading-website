import React, { useState, useEffect } from "react";
import { db } from "../../Firebase";
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import styles from "./AdminPanel.module.css";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [newProduct, setNewProduct] = useState({ title: "", price: "", category: "", image: "", stock: 10 });

  const showStatus = (text, type) => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: "", type: "" }), 3000);
  };

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, "products"), (s) => 
      setProducts(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsubO = onSnapshot(collection(db, "orders"), (s) => 
      setOrders(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => { unsubP(); unsubO(); };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), newProduct);
      setNewProduct({ title: "", price: "", category: "", image: "", stock: 10 });
      showStatus("Product added! ✅", "success");
    } catch (err) { 
      showStatus("Error adding product! ❌", "error"); 
    }
  };

  // --- DELETE ORDER FUNCTION ---
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        showStatus("Order deleted! 🗑️", "success");
      } catch (err) {
        showStatus("Failed to delete order!", "error");
      }
    }
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>ADMIN PANEL</h2>
        <button className={activeTab === "dashboard" ? styles.active : ""} onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>
        <button className={activeTab === "products" ? styles.active : ""} onClick={() => setActiveTab("products")}>📦 Products</button>
        <button className={activeTab === "orders" ? styles.active : ""} onClick={() => setActiveTab("orders")}>📋 Orders</button>
      </aside>

      <main className={styles.content}>
        {statusMsg.text && <div className={`${styles.notification} ${styles[statusMsg.type]}`}>{statusMsg.text}</div>}

        {activeTab === "dashboard" && (
          <div className={styles.list}>
            {products.map(p => (
              <div key={p.id} className={styles.itemCard} style={p.stock < 5 ? {borderLeft: '5px solid red'} : {}}>
                <img src={p.image || "https://via.placeholder.com/60"} alt="" />
                <span>{p.title} <br/><small>{p.stock < 5 ? "⚠️ Low Stock" : `In Stock: ${p.stock}`}</small></span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <form className={styles.addForm} onSubmit={handleAddProduct}>
              <h3>Add Product</h3>
              <input type="text" placeholder="Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} required />
              <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
              <div style={{gridColumn: '1/-1'}}>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
                {newProduct.image && <img src={newProduct.image} width="60" style={{marginTop:'10px'}} alt="" />}
              </div>
              <button type="submit">Save Product</button>
            </form>
            <table className={styles.userTable}>
                <thead><tr><th>Image</th><th>Name</th><th>Stock</th><th>Action</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} width="40" alt="" /></td>
                      <td>{p.title}</td>
                      <td>
                        <input 
                          type="number" 
                          defaultValue={p.stock} 
                          onBlur={e => updateDoc(doc(db, "products", p.id), {stock: Number(e.target.value)})} 
                          style={{ width: '50px', fontSize:'large', border: 'none', background: 'transparent', outline: 'none' }} 
                        />
                      </td>
                      <td>
                        <button onClick={() => deleteDoc(doc(db, "products", p.id))} style={{color:'red' , border :"none" , background:'transparent', cursor: 'pointer'}}>Delete 🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Contact & Address</th>
                  <th>Items Ordered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).map(o => (
                  <tr key={o.id}>
                    <td>
                      {o.timestamp?.seconds 
                        ? new Date(o.timestamp.seconds * 1000).toLocaleDateString() 
                        : "Just Now"}
                    </td>
                    <td><strong>{o.userName || "Unknown"}</strong></td>
                    <td>
                      <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        <span style={{ color: '#25d366', fontWeight: 'bold' }}>📞 {o.phone || "N/A"}</span>
                        <br />
                        <span style={{ color: '#666' }}>📍 {o.address || "No Address Provided"}</span>
                      </div>
                    </td>
                    <td>
                      <details className={styles.orderDetails}>
                        <summary style={{cursor:'pointer'}}>View {o.items?.length || 0} Items</summary>
                        <ul className={styles.itemsList}>
                          {o.items?.map((i, idx) => (
                            <li key={idx}>
                              {i.title} <strong>(x{i.quantity})</strong>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteOrder(o.id)} 
                        style={{color: 'red', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold'}}
                      >
                        Delete 🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;