import { DxcHeading, DxcParagraph, DxcFlex, DxcCard } from '@dxc-technology/halstack-react';

export default function Dashboard() {
  return (
    <DxcFlex direction="column" gap="2rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Vendor Management Dashboard" />

      <DxcFlex gap="1.5rem" wrap="wrap">
        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Active Vendors" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>24</strong>
          </DxcParagraph>
          <DxcParagraph>Vendors currently active</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Open Referrals" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>12</strong>
          </DxcParagraph>
          <DxcParagraph>Referrals in progress</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Pending Invoices" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>8</strong>
          </DxcParagraph>
          <DxcParagraph>Awaiting review</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="SLA Breaches" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem', color: '#D0011B' }}>3</strong>
          </DxcParagraph>
          <DxcParagraph>Require attention</DxcParagraph>
        </DxcCard>
      </DxcFlex>

      <DxcParagraph>
        Welcome to the Vendor Management Smart App. Use the navigation to manage vendors,
        create referrals, and process invoices.
      </DxcParagraph>
    </DxcFlex>
  );
}
