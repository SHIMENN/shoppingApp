import React from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import ToastNotification from '../../components/common/ToastNotification';
import { useAdminProducts } from '../../hooks/admin/useAdminProducts';
import ProductTable from '../../components/admin/ProductTable';
import ProductModal from '../../components/admin/ProductModal';

const AdminProducts: React.FC = () => {
  const {
    products, loading, toasts, removeToast, showModal, setShowModal,
    editingProduct, formData, setFormData, handleOpenModal, 
    handleSubmit, handleDelete, handleImageChange
  } = useAdminProducts();

  if (loading && products.length === 0) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="success" onClick={() => handleOpenModal()}>+ הוסף מוצר חדש</Button>
          <h2 className="fw-bold mb-0">ניהול קטלוג מוצרים</h2>
        </div>

        <ProductTable 
          products={products} 
          onOpenModal={handleOpenModal} 
          onDelete={handleDelete} 
        />

        <ProductModal 
          show={showModal}
          onHide={() => setShowModal(false)}
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  );
};

export default AdminProducts;