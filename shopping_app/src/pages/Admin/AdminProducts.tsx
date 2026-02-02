import React, { useState, useEffect } from 'react';
import { Button, Spinner, Tab, Tabs, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ToastNotification from '../../components/common/ToastNotification';
import { useAdminProducts } from '../../hooks/admin/useAdminProducts';
import ProductTable from '../../components/admin/ProductTable';
import ProductModal from '../../components/admin/ProductModal';

const AdminProducts: React.FC = () => {
  const location = useLocation();
  const {
    products, deletedProducts, loading, toasts, removeToast, showModal, setShowModal,
    editingProduct, formData, setFormData, handleOpenModal,
    handleSubmit, handleDelete, handleImageChange, loadDeletedProducts, handleRestore, loadProducts
  } = useAdminProducts();

  const [activeTab, setActiveTab] = useState('active');

  // טען את כל המוצרים בכל כניסה לדף
  useEffect(() => {
    loadProducts(1, 1000);
  }, [location.key]);

  const handleTabSelect = (key: string | null) => {
    if (key === 'deleted') {
      loadDeletedProducts();
    }
    setActiveTab(key || 'active');
  };

  if (loading && products.length === 0) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="success" onClick={() => handleOpenModal()}>+ הוסף מוצר חדש</Button>
          <h2 className="fw-bold mb-0">ניהול קטלוג מוצרים</h2>
        </div>

        <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
          <Tab eventKey="active" title="מוצרים פעילים">
            <ProductTable
              products={products}
              onOpenModal={handleOpenModal}
              onDelete={handleDelete}
            />
          </Tab>
          <Tab eventKey="deleted" title="מוצרים מחוקים">
            {loading ? (
              <Spinner animation="border" className="d-block mx-auto mt-3" />
            ) : deletedProducts.length === 0 ? (
              <p className="text-center text-muted mt-3">אין מוצרים מחוקים</p>
            ) : (
              <Table striped bordered hover responsive dir="rtl">
                <thead>
                  <tr>
                    <th>פעולות</th>
                    <th>מלאי</th>
                    <th>מחיר</th>
                    <th>שם</th>
                    <th>תמונה</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRestore(product.product_id)}
                        >
                          שחזר
                        </Button>
                      </td>
                      <td>{product.stock}</td>
                      <td>{product.price} ש"ח</td>
                      <td>{product.name}</td>
                      <td>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>

        <ProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          onSubmit={handleSubmit}
        />
      </>
    </>
  );
};

export default AdminProducts;