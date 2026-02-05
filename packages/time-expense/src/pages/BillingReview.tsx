import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function BillingReview() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Billing Review" />
      <DxcParagraph>Review and submit time/expense for billing - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
