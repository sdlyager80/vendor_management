import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function VendorOnboarding() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Vendor Onboarding" />
      <DxcParagraph>Vendor onboarding workflow - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
