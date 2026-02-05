import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function VendorOnboarding() {
  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={1} text="Vendor Onboarding" />
        <DxcParagraph>Vendor onboarding workflow - Coming soon</DxcParagraph>
      </DxcFlex>
    </div>
  );
}
