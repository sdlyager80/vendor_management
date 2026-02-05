import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function Configuration() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Configuration" />
      <DxcParagraph>Activity codes, rate schedules, event triggers - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
