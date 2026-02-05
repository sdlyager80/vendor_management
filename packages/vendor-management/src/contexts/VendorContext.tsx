import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Vendor, Referral, Invoice } from '@shared/types';

interface VendorContextType {
  vendors: Vendor[];
  referrals: Referral[];
  invoices: Invoice[];
  selectedVendor: Vendor | null;
  selectedReferral: Referral | null;
  setSelectedVendor: (vendor: Vendor | null) => void;
  setSelectedReferral: (referral: Referral | null) => void;
  refreshVendors: () => Promise<void>;
  refreshReferrals: () => Promise<void>;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const refreshVendors = useCallback(async () => {
    // TODO: Implement API call to fetch vendors
    console.log('Refreshing vendors...');
  }, []);

  const refreshReferrals = useCallback(async () => {
    // TODO: Implement API call to fetch referrals
    console.log('Refreshing referrals...');
  }, []);

  return (
    <VendorContext.Provider
      value={{
        vendors,
        referrals,
        invoices,
        selectedVendor,
        selectedReferral,
        setSelectedVendor,
        setSelectedReferral,
        refreshVendors,
        refreshReferrals,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendorContext() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendorContext must be used within a VendorProvider');
  }
  return context;
}
