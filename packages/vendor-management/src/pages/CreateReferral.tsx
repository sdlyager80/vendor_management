import { DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

export default function CreateReferral() {
  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={1} text="Create Referral" />
        <DxcParagraph>Create referral form - Coming soon</DxcParagraph>
      </DxcFlex>
    </div>
  );
}
