import { Spinner } from 'react-bootstrap';

const FullPageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">טוען נתונים...</p>
    </div>
  </div>
);

export default FullPageLoader;