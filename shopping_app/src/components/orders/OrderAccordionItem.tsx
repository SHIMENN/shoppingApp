import React from 'react';
import { Accordion, Badge, Table, Button, Spinner } from 'react-bootstrap';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaStickyNote, FaTrash } from 'react-icons/fa';
import type { Order } from '../../types/order';

interface OrderAccordionItemProps {
  order: Order;
  eventKey: string;
  onDelete: (orderId: number) => void;
  isDeleting: boolean;
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; icon: React.ReactNode; textClass: string }> = {
    pending: { bg: 'warning', text: 'ממתין לעיבוד', icon: <FaClock />, textClass: 'text-warning' },
    shipped: { bg: 'info', text: 'בדרך אליך', icon: <FaShippingFast />, textClass: 'text-info' },
    delivered: { bg: 'success', text: 'נמסר', icon: <FaCheckCircle />, textClass: 'text-success' },
    cancelled: { bg: 'danger', text: 'בוטל', icon: <FaTimesCircle />, textClass: 'text-danger' },
  };
  return statusMap[status] || { bg: 'secondary', text: status, icon: <FaBox />, textClass: 'text-secondary' };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrderAccordionItem: React.FC<OrderAccordionItemProps> = ({ order, eventKey, onDelete, isDeleting }) => {
  const statusInfo = getStatusInfo(order.status);
  const canDelete = order.status === 'cancelled' || order.status === 'delivered';

  return (
    <Accordion.Item eventKey={eventKey} className="border-0 shadow-sm mb-3 rounded overflow-hidden">
      <Accordion.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center w-100 pe-3">
          <div className="d-flex align-items-center">
            <div className={`rounded-circle bg-${statusInfo.bg} bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center ${statusInfo.textClass}`}>
              {statusInfo.icon}
            </div>
            <div>
              <div className="fw-bold">הזמנה #{order.order_id}</div>
              <small className="text-muted">{formatDate(order.order_date)}</small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Badge bg={statusInfo.bg} className="px-3 py-2">{statusInfo.text}</Badge>
            <span className="fw-bold">₪{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Body className="bg-white pt-0">
        {order.shipping_address && (
          <div className="bg-light rounded p-3 mb-3">
            <div className="d-flex align-items-start">
              <FaMapMarkerAlt className="text-muted mt-1 me-2" />
              <div>
                <div className="small text-muted mb-1">כתובת משלוח</div>
                <div>{order.shipping_address}</div>
              </div>
            </div>
          </div>
        )}

        {order.notes && (
          <div className="bg-light rounded p-3 mb-3">
            <div className="d-flex align-items-start">
              <FaStickyNote className="text-muted mt-1 me-2" />
              <div>
                <div className="small text-muted mb-1">הערות</div>
                <div>{order.notes}</div>
              </div>
            </div>
          </div>
        )}

        <Table responsive hover size="sm" className="mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0">מוצר</th>
              <th className="border-0 text-center">כמות</th>
              <th className="border-0">מחיר</th>
              <th className="border-0">סה"כ</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.order_item_id}>
                <td className="align-middle">
                  <span className="fw-medium">{item.product?.name || 'מוצר'}</span>
                </td>
                <td className="align-middle text-center">{item.quantity}</td>
                <td className="align-middle text-muted">₪{Number(item.price).toFixed(2)}</td>
                <td className="align-middle fw-bold">₪{(Number(item.price) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-top">
            <tr>
              <td colSpan={3} className="text-start fw-bold pt-3">סה"כ</td>
              <td className="fw-bold pt-3">₪{Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </Table>

        <div className="mt-3 pt-3 border-top d-flex align-items-center">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(order.order_id)}
            disabled={isDeleting || !canDelete}
          >
            {isDeleting ? (
              <><Spinner animation="border" size="sm" className="me-1" />מוחק...</>
            ) : (
              <><FaTrash className="me-1" />מחק הזמנה</>
            )}
          </Button>
          {!canDelete && (
            <small className="text-muted me-2">ניתן למחוק רק הזמנות שבוטלו או נמסרו</small>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default OrderAccordionItem;
