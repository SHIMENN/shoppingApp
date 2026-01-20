import { Button } from 'react-bootstrap';

interface SocialButtonsProps {
  onGoogleLogin: () => void;
}

const SocialButtons: React.FC<SocialButtonsProps> = ({ onGoogleLogin }) => (
  <div className="mt-3">
    <Button variant="outline-danger" className="w-100" onClick={onGoogleLogin}>
      <i className="bi bi-google me-2"></i> התחבר עם Google
    </Button>
  </div>
);

export default SocialButtons;