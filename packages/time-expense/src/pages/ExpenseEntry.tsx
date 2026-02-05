import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function ExpenseEntry() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Expense Entry" />
      <DxcParagraph>Expense entry form - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
