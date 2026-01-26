import React from 'react';
import { Table, Button, Badge, Image } from 'react-bootstrap';

interface Props {
  products: any[];
  onOpenModal: (product: any) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({ products, onOpenModal, onDelete }) => (
  <Table striped bordered hover responsive className="text-end shadow-sm">
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
            <Image src={p.image_url || 'https://via.placeholder.com/50'} rounded style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          </td>
          <td>{p.product_id}</td>
          <td className="fw-bold">{p.name}</td>
          <td className="text-success fw-bold">₪{p.price}</td>
          <td>
            <Badge bg={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>{p.stock} יחידות</Badge>
          </td>
          <td>
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="primary" size="sm" onClick={() => onOpenModal(p)}>✏️ ערוך</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(p.product_id)}>🗑️ מחק</Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default ProductTable;