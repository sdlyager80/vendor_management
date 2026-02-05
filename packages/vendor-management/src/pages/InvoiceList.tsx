import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function InvoiceList() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Invoices" />
      <DxcParagraph>Invoice list view - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
