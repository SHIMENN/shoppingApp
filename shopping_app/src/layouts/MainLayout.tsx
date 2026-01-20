import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { Navbar as AppNavbar } from '../components/navigation';

const MainLayout: React.FC = () => {
  return (
    <>
      <AppNavbar />
      <main className="py-4">
        <Container>
          {/* ה-Outlet מרנדר את הקומפוננטה של הנתיב הנוכחי */}
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default MainLayout;