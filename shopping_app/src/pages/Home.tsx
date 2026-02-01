import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Badge, Modal, Button, Image, Spinner } from 'react-bootstrap';
import { FaCartPlus, FaCreditCard } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';
import { ProductCard, ProductSkeleton } from '../components/product';
import ToastNotification from '../components/common/ToastNotification';
import { useHome } from '../hooks/useHome';
import HomeFilters from '../components/home/HomeFilters';
import HomeInfoSection from '../components/home/HomeInfoSection';
import { type Product } from '../types/product';

const Home: React.FC = () => {
  const { products, loading, loadingMore, error, hasMore, loadMore } = useProducts();

  // Infinite scroll - טעינה אוטומטית כשמגיעים לתחתית
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // טען עוד כשנשארו 300 פיקסלים לסוף הדף
      if (scrollTop + windowHeight >= documentHeight - 300) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loadMore]);
  
  // סטייט למוצר שנבחר להצגה במסך מלא
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    filterStock, setFilterStock,
    filteredProducts,
    handleAddToCart,
    toasts, removeToast
  } = useHome(products || []);

  if (loading) return <ProductSkeleton count={8} />;//הצגת מוצרים ריקים
  if (error) return <Alert variant="danger" className="m-5 text-center">{error}</Alert>;

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      
      <Container className="py-4" dir="rtl">
        {/* כותרת האתר */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2 text-danger">כל בו אקספרס 🛍️</h1>
          <p className="text-muted fs-5">איכות, שירות ומחיר במקום אחד</p>
        </div>

        {/* פילטרים */}
        <HomeFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          sortBy={sortBy} setSortBy={setSortBy}
          filterStock={filterStock} setFilterStock={setFilterStock}
        />

        <div className="mb-3 text-end">
          <Badge bg="primary" className="py-2 px-3">
            {filteredProducts.length} מוצרים נמצאו
          </Badge>
        </div>

        {/* גריד המוצרים */}
        {filteredProducts.length === 0 ? (
          <Alert variant="warning" className="text-center py-5">
            <h5>לא נמצאו מוצרים תואמים לחיפוש 🔍</h5>
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.product_id}>
                <ProductCard //הצגת מוצרים
                  product={product}
                  onClick={(p) => setSelectedProduct(p)}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Loading indicator */}
        {loadingMore && (
          <div className="py-4 text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        <HomeInfoSection />
      </Container>

      {/* --- מודל מוצר במסך מלא --- */}
      <Modal 
        show={!!selectedProduct} 
        onHide={() => setSelectedProduct(null)}
        size="lg"
        centered
        dir="rtl"
      >
        {selectedProduct && (
          <>
            <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
            <Modal.Body className="pt-0 px-4 pb-4">
              <Row className="align-items-center">
                {/* תמונה בצד אחד */}
                <Col md={6} className="text-center mb-4 mb-md-0">
                  <Image 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name} 
                    fluid 
                    className="rounded-4 shadow-sm"
                    style={{ maxHeight: '450px', objectFit: 'contain' }}
                  />
                </Col>
                
                {/* פרטים בצד שני */}
                <Col md={6}>
                  <h2 className="fw-bold mb-2">{selectedProduct.name}</h2>
                  <h3 className="text-danger fw-bold mb-4 display-6">₪{selectedProduct.price}</h3>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark">תיאור המוצר:</h6>
                    <p className="text-muted">
                      {selectedProduct.description || "מוצר איכותי שנבחר בקפידה עבור לקוחות כל בו אקספרס."}
                    </p>
                  </div>

                  {/* כפתורי פעולה */}
                  <div className="d-grid gap-3">
                    <Button 
                      variant="danger" 
                      size="lg" 
                      className="py-3 fw-bold"
                      disabled={selectedProduct.stock <= 0}
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        window.location.href = '/checkout'; // מעבר ישיר לתשלום
                      }}
                    >
                      <FaCreditCard className="me-2" /> הזמן עכשיו
                    </Button>
                    
                    <Button 
                      variant="outline-dark" 
                      size="lg" 
                      className="py-3 fw-bold"
                      disabled={selectedProduct.stock <= 0}
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null); // סגירה לאחר הוספה
                      }}
                    >
                      <FaCartPlus className="me-2" /> הוספה לעגלה
                    </Button>
                  </div>
                  
                  {selectedProduct.stock <= 0 && (
                    <div className="text-danger mt-3 fw-bold text-center">
                      מצטערים, המוצר אזל מהמלאי
                    </div>
                  )}
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