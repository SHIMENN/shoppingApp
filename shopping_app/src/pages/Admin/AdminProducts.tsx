import React, { useState, useEffect } from 'react';
import { Button, Spinner, Tab, Tabs, Table, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FaPlus, FaUndo } from 'react-icons/fa'; // הוספת אייקונים למובייל
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      
      {/* שורת פעולות עליונה - מותאמת למובייל */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <Button 
          variant="success" 
          onClick={() => handleOpenModal()} 
          className="d-flex align-items-center justify-content-center px-4 py-2 shadow-sm"
        >
          <FaPlus className="me-2" /> הוסף מוצר חדש
        </Button>
        <h4 className="fw-bold mb-0 text-secondary d-none d-md-block">ניהול מלאי</h4>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onSelect={handleTabSelect} 
        className="mb-3 custom-tabs border-0" 
        justify // הופך את הטאבים לרחבים יותר במובייל
      >
        <Tab eventKey="active" title="מוצרים פעילים">
          <div className="mt-3">
            <ProductTable
              products={products}
              onOpenModal={handleOpenModal}
              onDelete={handleDelete}
            />
          </div>
        </Tab>
        
        <Tab eventKey="deleted" title="ארכיון מחוקים">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="secondary" size="sm" />
            </div>
          ) : deletedProducts.length === 0 ? (
            <Card className="border-0 bg-light text-center py-5 mt-3">
              <p className="text-muted mb-0">אין מוצרים מחוקים בארכיון</p>
            </Card>
          ) : (
            <>
              {/* Mobile - Cards */}
              <div className="d-md-none mt-3 d-flex flex-column gap-3">
                {deletedProducts.map((product) => (
                  <Card key={product.product_id} className="border-0 shadow-sm">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="rounded-2 shadow-sm"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1 text-end">
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">{product.price} ₪ | מלאי: {product.stock}</small>
                      </div>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleRestore(product.product_id)}
                      >
                        <FaUndo className="me-1" /> שחזר
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Desktop - Table */}
              <div className="table-responsive mt-3 shadow-sm rounded-3 d-none d-md-block">
                <Table hover className="mb-0 bg-white">
                  <thead className="bg-light">
                    <tr className="text-center">
                      <th className="py-3">תמונה</th>
                      <th className="py-3 text-start">שם המוצר</th>
                      <th className="py-3">מחיר</th>
                      <th className="py-3">מלאי</th>
                      <th className="py-3">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedProducts.map((product) => (
                      <tr key={product.product_id} className="text-center align-middle">
                        <td>
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="rounded-2 shadow-sm"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className="text-start fw-medium">{product.name}</td>
                        <td>{product.price} ₪</td>
                        <td>{product.stock}</td>
                        <td>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="d-flex align-items-center justify-content-center mx-auto"
                            onClick={() => handleRestore(product.product_id)}
                          >
                            <FaUndo className="me-1" /> שחזר
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
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
  );
};

export default AdminProducts;