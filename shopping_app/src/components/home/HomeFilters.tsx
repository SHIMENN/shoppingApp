import React, { useState } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: string;
  setSortBy: (val: any) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  maxPrice: number;
}

const HomeFilters: React.FC<Props> = ({
  searchTerm, setSearchTerm,
  sortBy, setSortBy,
  priceRange, setPriceRange,
  maxPrice
}) => {
  const [minText, setMinText] = useState(String(priceRange?.[0] ?? 0));
  const [maxText, setMaxText] = useState(String(priceRange?.[1]?? maxPrice));

  React.useEffect(() => {
    setMinText(String(priceRange?.[0] ?? 0));
    setMaxText(String(priceRange?.[1] ?? maxPrice));
  }, [priceRange, maxPrice]);

  const applyMin = (text: string) => {
    const num = Number(text) || 0;
    const clamped = Math.max(0, Math.min(num, priceRange[1]));
    setPriceRange([clamped, priceRange[1]]);
    setMinText(String(clamped));
  };

  const applyMax = (text: string) => {
    const num = Number(text) || 0;
    const clamped = Math.max(priceRange[0], Math.min(num, maxPrice));
    setPriceRange([priceRange[0], clamped]);
    setMaxText(String(clamped));
  };

  return (
    <Row className="mb-4 align-items-end">
      <Col md={4} className="mb-3">
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

      <Col md={5} className="mb-3">
        <div className="text-end mb-2">
          <Form.Label className="fw-bold small mb-0">
            טווח מחיר: ₪{priceRange[0]} – ₪{priceRange[1]}
          </Form.Label>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            inputMode="numeric"
            value={minText}
            onChange={(e) => setMinText(e.target.value)}
            onBlur={() => applyMin(minText)}
            onKeyDown={(e) => e.key === 'Enter' && applyMin(minText)}
            className="text-center"
            size="sm"
            placeholder="ממחיר"
          />
          <span className="text-muted small">עד</span>
          <Form.Control
            type="text"
            inputMode="numeric"
            value={maxText}
            onChange={(e) => setMaxText(e.target.value)}
            onBlur={() => applyMax(maxText)}
            onKeyDown={(e) => e.key === 'Enter' && applyMax(maxText)}
            className="text-center"
            size="sm"
            placeholder="עד מחיר"
          />
        </div>
      </Col>
    </Row>
  );
};

export default HomeFilters;
