import { Routes, Route, Navigate } from 'react-router-dom';
import { DxcApplicationLayout } from '@dxc-technology/halstack-react';
import { TimeExpenseProvider } from './contexts/TimeExpenseContext';
import Dashboard from './pages/Dashboard';
import TimeEntry from './pages/TimeEntry';
import ExpenseEntry from './pages/ExpenseEntry';
import BillingReview from './pages/BillingReview';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';

function App() {
  return (
    <TimeExpenseProvider>
      <DxcApplicationLayout>
        <DxcApplicationLayout.Header>
          <DxcApplicationLayout.Header.Title>
            Time & Expense
          </DxcApplicationLayout.Header.Title>
          <DxcApplicationLayout.Header.Subtitle>
            Claims Smart Apps
          </DxcApplicationLayout.Header.Subtitle>
        </DxcApplicationLayout.Header>

        <DxcApplicationLayout.Main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

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
    </TimeExpenseProvider>
  );
}

export default App;
