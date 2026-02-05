import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function VendorList() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Vendor Directory" />
      <DxcParagraph>Vendor list view - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
