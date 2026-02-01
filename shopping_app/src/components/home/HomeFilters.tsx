import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: any;
  setSortBy: (val: any) => void;
  filterStock: any;
  setFilterStock: (val: any) => void;
}

const HomeFilters: React.FC<Props> = ({ searchTerm, setSearchTerm, sortBy, setSortBy, filterStock, setFilterStock }) => (
  <Row className="mb-4">
    <Col md={6} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="חפש מוצר לפי שם או תיאור..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-end"
        />
        <InputGroup.Text>🔍</InputGroup.Text>
      </InputGroup>
    </Col>
    <Col md={3} className="mb-3">
      <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-end">
        <option value="default">סדר ברירת מחדל</option>
        <option value="name">מיין לפי שם</option>
        <option value="price-asc">מחיר: מהנמוך לגבוה</option>
        <option value="price-desc">מחיר: מהגבוה לנמוך</option>
      </Form.Select>
    </Col>
    <Col md={3} className="mb-3">
      <Form.Select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="text-end">
        <option value="all">כל המוצרים</option>
        <option value="in-stock">במלאי בלבד</option>
        <option value="low-stock">מלאי נמוך</option>
      </Form.Select>
    </Col>
  </Row>
);

export default HomeFilters;