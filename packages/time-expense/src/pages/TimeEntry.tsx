import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function TimeEntry() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Time Entry" />
      <DxcParagraph>Time entry form with timer - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
