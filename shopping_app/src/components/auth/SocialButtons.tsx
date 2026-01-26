import { Button } from 'react-bootstrap';
import {type  SocialButtonsProps}from '../../types/admin'

const SocialButtons: React.FC<SocialButtonsProps> = ({ onGoogleLogin }) => (
  <div className="mt-3">
    <Button variant="outline-danger" className="w-100" onClick={onGoogleLogin}>
      <i className="bi bi-google me-2"></i> Google
    </Button>
  </div>
);

export default SocialButtons;