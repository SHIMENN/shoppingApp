import React from 'react';
import { Table, Button, Badge, Image, Accordion } from 'react-bootstrap';

interface Props {
  products: any[];
  onOpenModal: (product: any) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({ products, onOpenModal, onDelete }) => (
  <>
    {/* תצוגת מובייל - כרטיסי אקורדיון */}
    <Accordion className="d-md-none">
      {products.map(p => (
        <Accordion.Item eventKey={String(p.product_id)} key={p.product_id}>
          <Accordion.Header>
            <div className="d-flex align-items-center gap-3 w-100">
              <Image
                src={p.image_url || 'https://via.placeholder.com/50'}
                rounded
                width={50}
                height={50}
                className="object-fit-cover"
              />
              <div className="text-end flex-grow-1">
                <div className="fw-bold">{p.name}</div>
                <div className="text-success fw-bold">₪{p.price}</div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body className="text-end">
            <div className="mb-2">
              <span className="text-muted">מזהה: </span>{p.product_id}
            </div>
            <div className="mb-3">
              <span className="text-muted">מלאי: </span>
              <Badge bg={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>
                {p.stock} יחידות
              </Badge>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="primary" size="sm" onClick={() => onOpenModal(p)}>ערוך</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(p.product_id)}>מחק</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>

    {/* תצוגת דסקטופ - טבלה */}
    <Table striped bordered hover responsive className="text-end shadow-sm d-none d-md-table">
      <thead className="table-dark">
        <tr>
          <th>תמונה</th>
          <th>מזהה</th>
          <th>שם המוצר</th>
          <th>מחיר</th>
          <th>מלאי</th>
          <th>פעולות</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.product_id}>
            <td>
              <Image
                src={p.image_url || 'https://via.placeholder.com/50'}
                rounded
                width={50}
                height={50}
                className="object-fit-cover"
              />
            </td>
            <td>{p.product_id}</td>
            <td className="fw-bold">{p.name}</td>
            <td className="text-success fw-bold">₪{p.price}</td>
            <td>
              <Badge bg={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>{p.stock} יחידות</Badge>
            </td>
            <td>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" size="sm" onClick={() => onOpenModal(p)}>ערוך</Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(p.product_id)}>מחק</Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);

export default ProductTable;
