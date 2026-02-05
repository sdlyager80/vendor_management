import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function BillingReview() {
  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={1} text="Billing Review" />
        <DxcParagraph>Review and submit time/expense for billing - Coming soon</DxcParagraph>
      </DxcFlex>
    </div>
  );
}
