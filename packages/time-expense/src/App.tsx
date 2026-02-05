import { Routes, Route, Navigate } from 'react-router-dom';
import { DxcApplicationLayout, DxcSelect, DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';
import { TimeExpenseProvider, useTimeExpenseContext } from './contexts/TimeExpenseContext';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';
import TimeEntry from './pages/TimeEntry';
import ExpenseEntry from './pages/ExpenseEntry';
import BillingReview from './pages/BillingReview';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import { formatCurrency } from '@shared/utils';

function AppContent() {
  const { currentAdjuster, adjusters, setCurrentAdjuster } = useTimeExpenseContext();

  const getAdjusterInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getAdjusterColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'Senior Adjuster': '#68b3c8',
      'Manager': '#7b1fa2',
      'Staff Adjuster': '#388e3c',
      'Junior Adjuster': '#f57c00',
      'Administrative': '#9e9e9e',
    };
    return colors[roleName] || '#68b3c8';
  };

  return (
    <DxcApplicationLayout>
      <DxcApplicationLayout.Header>
        <DxcApplicationLayout.Header.Title>
          Time & Expense
        </DxcApplicationLayout.Header.Title>
        <DxcApplicationLayout.Header.Subtitle>
          Claims Smart Apps
        </DxcApplicationLayout.Header.Subtitle>

        {currentAdjuster && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <DxcFlex direction="column" gap="4px" alignItems="flex-end">
              <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#FFFFFF">
                {currentAdjuster.firstName} {currentAdjuster.lastName}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.8)">
                {currentAdjuster.roleName} • {formatCurrency(currentAdjuster.defaultRate)}/hr
              </DxcTypography>
            </DxcFlex>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: getAdjusterColor(currentAdjuster.roleName),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {getAdjusterInitials(currentAdjuster.firstName, currentAdjuster.lastName)}
            </div>
            <DxcSelect
              label="Switch User"
              options={adjusters.map((adj) => ({
                label: `${adj.firstName} ${adj.lastName} - ${adj.roleName}`,
                value: adj.id,
              }))}
              value={currentAdjuster.id}
              onChange={(value) => {
                const selected = adjusters.find((adj) => adj.id === value);
                if (selected) {
                  setCurrentAdjuster(selected);
                }
              }}
              size="small"
            />
          </div>
        )}
      </DxcApplicationLayout.Header>

        <DxcApplicationLayout.Main>
          <Routes>
            <Route path="/" element={<Navigate to="/claims" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Claims */}
            <Route path="/claims" element={<Claims />} />
            <Route path="/claims/:claimNumber" element={<ClaimDetail />} />

            {/* Time & Expense Entry */}
            <Route path="/time" element={<TimeEntry />} />
            <Route path="/expense" element={<ExpenseEntry />} />

            {/* Billing & Review */}
            <Route path="/billing" element={<BillingReview />} />

            {/* Reports */}
            <Route path="/reports" element={<Reports />} />

            {/* Configuration */}
            <Route path="/config" element={<Configuration />} />
          </Routes>
        </DxcApplicationLayout.Main>
      </DxcApplicationLayout>
  );
}

function App() {
  return (
    <TimeExpenseProvider>
      <AppContent />
    </TimeExpenseProvider>
  );
}

export default App;
