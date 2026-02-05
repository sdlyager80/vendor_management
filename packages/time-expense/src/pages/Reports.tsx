import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function Reports() {
  return (
    <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Reports & Analytics" />
      <DxcParagraph>Time & expense reports - Coming soon</DxcParagraph>
    </DxcFlex>
  );
}
