import { DxcHeading, DxcParagraph, DxcFlex, DxcCard } from '@dxc-technology/halstack-react';

export default function Dashboard() {
  return (
    <DxcFlex direction="column" gap="2rem" style={{ padding: '2rem' }}>
      <DxcHeading level={1} text="Time & Expense Dashboard" />

      <DxcFlex gap="1.5rem" wrap="wrap">
        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Today's Hours" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>6.5</strong>
          </DxcParagraph>
          <DxcParagraph>Hours logged today</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="This Week" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>32.0</strong>
          </DxcParagraph>
          <DxcParagraph>Total hours this week</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Pending Entries" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>5</strong>
          </DxcParagraph>
          <DxcParagraph>Awaiting submission</DxcParagraph>
        </DxcCard>

        <DxcCard
          style={{ minWidth: '300px', padding: '1.5rem' }}
        >
          <DxcHeading level={3} text="Auto-Captured" />
          <DxcParagraph>
            <strong style={{ fontSize: '2rem' }}>14</strong>
          </DxcParagraph>
          <DxcParagraph>Events this week</DxcParagraph>
        </DxcCard>
      </DxcFlex>

      <DxcParagraph>
        Welcome to the Time & Expense Smart App. Log your time manually, use the timer,
        or review auto-captured entries from Assure Claims events.
      </DxcParagraph>
    </DxcFlex>
  );
}
