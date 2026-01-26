import React from 'react';
import { Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useProducts } from '../hooks/useProducts';
import { ProductCard, ProductSkeleton } from '../components/product';
import ToastNotification from '../components/common/ToastNotification';

// ייבוא של מה שפיצלנו
import { useHome } from '../hooks/useHome';
import HomeFilters from '../components/home/HomeFilters';
import HomeInfoSection from '../components/home/HomeInfoSection';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();
  
  // שימוש ב-Hook החדש
  const {
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    filterStock, setFilterStock,
    filteredProducts,
    handleAddToCart,
    toasts, removeToast
  } = useHome(products || []);

  if (loading) return <ProductSkeleton count={6} />;
  if (error) return <div className="alert alert-danger text-end">{error}</div>;

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <Container className="py-4">
        
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2 text-danger"> כל בו אקספרס 🛍️</h1>
          <p className="text-warning">מחירים ללא תחרות</p>
        </div>

        <HomeFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          sortBy={sortBy} setSortBy={setSortBy}
          filterStock={filterStock} setFilterStock={setFilterStock}
        />

        <div className="mb-3 text-end">
          <Badge bg="primary" className="fs-6">
            {filteredProducts.length} מוצרים נמצאו
          </Badge>
        </div>

        {filteredProducts.length === 0 ? (
          <Alert variant="warning" className="text-center">
            <h5>לא נמצאו מוצרים התואמים לחיפוש שלך 🔍</h5>
            <p className="mb-0">נסה לשנות את מילות החיפוש או הסינונים</p>
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.product_id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Col>
            ))}
          </Row>
        )}

        <HomeInfoSection />
      </Container>
    </>
  );
};

export default Home;