import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {/* לא מציגים Header בעמוד הנחיתה */}
      {!isLanding && <Header />}
      <Outlet />
    </>
  );
}

export default Layout;
