import { Routes, Route, Navigate } from 'react-router-dom';
import { DxcApplicationLayout } from '@dxc-technology/halstack-react';
import { VendorProvider } from './contexts/VendorContext';
import VendorList from './pages/VendorList';
import VendorDetails from './pages/VendorDetails';
import VendorOnboarding from './pages/VendorOnboarding';
import ReferralList from './pages/ReferralList';
import ReferralDetails from './pages/ReferralDetails';
import CreateReferral from './pages/CreateReferral';
import InvoiceList from './pages/InvoiceList';
import VendorPortal from './pages/VendorPortal';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <VendorProvider>
      <DxcApplicationLayout>
        <DxcApplicationLayout.Header>
          <DxcApplicationLayout.Header.Title>
            Vendor Management
          </DxcApplicationLayout.Header.Title>
          <DxcApplicationLayout.Header.Subtitle>
            Claims Smart Apps
          </DxcApplicationLayout.Header.Subtitle>
        </DxcApplicationLayout.Header>

        <DxcApplicationLayout.Main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Vendor Management */}
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/:vendorId" element={<VendorDetails />} />
            <Route path="/vendors/onboard/new" element={<VendorOnboarding />} />

            {/* Referral Management */}
            <Route path="/referrals" element={<ReferralList />} />
            <Route path="/referrals/new" element={<CreateReferral />} />
            <Route path="/referrals/:referralId" element={<ReferralDetails />} />

            {/* Billing & Invoices */}
            <Route path="/invoices" element={<InvoiceList />} />

            {/* Vendor Portal */}
            <Route path="/portal" element={<VendorPortal />} />
          </Routes>
        </DxcApplicationLayout.Main>
      </DxcApplicationLayout>
    </VendorProvider>
  );
}

export default App;
