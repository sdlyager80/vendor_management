import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function VendorDetails() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Vendor Details" />
      <DxcParagraph>Vendor details view - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
