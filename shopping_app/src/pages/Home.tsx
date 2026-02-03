import React, { useState } from 'react';
import { Row, Col, Alert, Badge, Modal, Button, Image, Spinner } from 'react-bootstrap';
import { FaCartPlus, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useProducts } from '../hooks/useProducts';
import { useHome } from '../hooks/useHome';

import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

// Components
import { ProductCard, ProductSkeleton } from '../components/product';
import ToastNotification from '../components/common/ToastNotification';
import HomeFilters from '../components/home/HomeFilters';
import HomeInfoSection from '../components/home/HomeInfoSection';
import { type Product } from '../types/product';


const Home: React.FC = () => {
  const { products, loading, loadingMore, error, hasMore, loadMore, loadAll } = useProducts();

  const navigate = useNavigate();
  
  // 1. קודם כל מפעילים את כל ה-Hooks
  useInfiniteScroll(loadMore, hasMore, loadingMore);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // הזזתי את זה לכאן - מעל ה-if
  const {
    searchTerm, setSearchTerm, sortBy, setSortBy,
    priceRange, setPriceRange, maxPrice, isPriceFiltered,
    filteredProducts, handleAddToCart, toasts, removeToast
  } = useHome(products || [], loadAll);

  // 2. רק אחר כך עושים check ל-loading או error
  if (loading) return <ProductSkeleton count={8} />;
  if (error) return <Alert variant="danger" className="m-5 text-center">{error}</Alert>;
  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />

      {/* כותרת האתר */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2 text-danger">כל בו אקספרס</h1>
          <p className="text-muted fs-5">איכות, שירות ומחיר במקום אחד</p>
        </div>

        {/* פילטרים */}
        <HomeFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          sortBy={sortBy} setSortBy={setSortBy}
          priceRange={priceRange} setPriceRange={setPriceRange}
          maxPrice={maxPrice}
        />

        {(searchTerm || isPriceFiltered) && (
          <div className="mb-3 text-end">
            <Badge bg="primary" className="py-2 px-3">
              {filteredProducts.length} מוצרים נמצאו
            </Badge>
          </div>
        )}

        {/* גריד המוצרים */}
        {filteredProducts.length === 0 ? (
          <Alert variant="warning" className="text-center py-5">
            <h5>לא נמצאו מוצרים תואמים לחיפוש</h5>
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.product_id}>
                <ProductCard product={product} onClick={(p) => setSelectedProduct(p)} />
              </Col>
            ))}
          </Row>
        )}
        
        {/* מחוון טעינה נוספת */}
        {loadingMore && (
          <div className="py-4 text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        <HomeInfoSection />

      <Modal show={!!selectedProduct} onHide={() => setSelectedProduct(null)} size="lg" fullscreen="sm-down" centered dir="rtl">
        {selectedProduct && (
          <>
            <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
            <Modal.Body className="pt-0 px-4 pb-4">
              <Row className="align-items-center">
                <Col md={6} className="text-center mb-3 mb-md-0">
                  <Image src={selectedProduct.image_url} fluid className="rounded-4 shadow-sm" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                </Col>
                <Col md={6}>
                  <h2 className="fw-bold">{selectedProduct.name}</h2>
                  {selectedProduct.description && (
                    <p className="text-muted">{selectedProduct.description}</p>
                  )}
                  <h3 className="text-danger fw-bold mb-4">₪{selectedProduct.price}</h3>
                  <div className="d-grid gap-3">

                    {/*כפתור הזמנה*/}
                    <Button variant="danger" size="lg" onClick={() => {
                        handleAddToCart(selectedProduct);
                        navigate('/checkout');
                    }}>
                      <FaCreditCard className="me-2" /> הזמן עכשיו
                    </Button>
                    <Button variant="outline-dark" size="lg" onClick={async () => {
                        await handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                    }}>
                      <FaCartPlus className="me-2" /> הוספה לעגלה
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default Home;