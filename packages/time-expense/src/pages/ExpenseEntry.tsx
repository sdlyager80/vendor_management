import { useEffect, useState } from 'react';
import {
  DxcFlex,
  DxcCard,
  DxcTextInput,
  DxcSelect,
  DxcTextarea,
  DxcButton,
  DxcHeading,
} from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatCurrency } from '@shared/utils';
import { expenseService } from '../services/expenseService';
import type { ExpenseEntry, ExpenseType } from '@shared/types';

export default function ExpenseEntryPage() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    claimNumber: '',
    expenseTypeId: '',
    amount: '',
    quantity: '',
    entryDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, types] = await Promise.all([
        expenseService.getExpenseEntries(),
        expenseService.getExpenseTypes(),
      ]);
      setExpenses(expensesData);
      setExpenseTypes(types);
    } catch (error) {
      console.error('Failed to load expense entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async () => {
    try {
      const selectedType = expenseTypes.find((t) => t.id === formData.expenseTypeId);
      if (!selectedType) return;

      const newExpense: Partial<ExpenseEntry> = {
        claimNumber: formData.claimNumber,
        adjusterId: 'ADJ-001',
        adjusterName: 'Current User',
        expenseTypeId: formData.expenseTypeId,
        expenseCode: selectedType.code,
        expenseDescription: selectedType.name,
        entryDate: formData.entryDate,
        amount: parseFloat(formData.amount),
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        receiptAttached: false,
        status: 'DRAFT',
        notes: formData.notes,
        createdBy: 'ADJ-001',
        createdDate: new Date().toISOString(),
      };

      await expenseService.createExpenseEntry(newExpense);

      // Reset form and reload
      setFormData({
        claimNumber: '',
        expenseTypeId: '',
        amount: '',
        quantity: '',
        entryDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to create expense entry:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expenseService.deleteExpenseEntry(expenseId);
      loadData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const selectedType = expenseTypes.find((t) => t.id === formData.expenseTypeId);

  if (loading) {
    return <LoadingSpinner text="Loading expenses..." />;
  }

  return (
    <DxcFlex direction="column" gap="1.5rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Expense Entry"
        subtitle={`${expenses.length} expenses`}
        actions={[
          {
            label: showForm ? 'Cancel' : 'New Expense',
            onClick: () => setShowForm(!showForm),
            mode: 'primary',
          },
        ]}
      />

      {/* Entry Form */}
      {showForm && (
        <DxcCard style={{ padding: '1.5rem' }}>
          <DxcHeading level={3} text="New Expense Entry" />

          <DxcFlex direction="column" gap="1rem" style={{ marginTop: '1rem' }}>
            <DxcTextInput
              label="Claim Number"
              value={formData.claimNumber}
              onChange={(value) => setFormData({ ...formData, claimNumber: value })}
              placeholder="CLM-2024-001234"
            />

            <DxcSelect
              label="Expense Type"
              options={expenseTypes
                .filter((t) => t.isActive)
                .map((t) => ({
                  label: `${t.code} - ${t.name}`,
                  value: t.id,
                }))}
              value={formData.expenseTypeId}
              onChange={(value) => setFormData({ ...formData, expenseTypeId: value })}
            />

            {selectedType?.rateType === 'PER_UNIT' && (
              <DxcTextInput
                label="Quantity"
                value={formData.quantity}
                onChange={(value) => setFormData({ ...formData, quantity: value })}
                placeholder={
                  selectedType.code === 'MILEAGE' ? 'Miles' : 'Quantity'
                }
                helperText={
                  selectedType.defaultRate
                    ? `Rate: ${formatCurrency(selectedType.defaultRate)} per unit`
                    : undefined
                }
              />
            )}

            <DxcTextInput
              label="Amount"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              placeholder="0.00"
              helperText={
                selectedType?.rateCap
                  ? `Maximum allowed: ${formatCurrency(selectedType.rateCap)}`
                  : undefined
              }
            />

            <DxcTextInput
              label="Date"
              value={formData.entryDate}
              onChange={(value) => setFormData({ ...formData, entryDate: value })}
              type="date"
            />

            <DxcTextarea
              label="Notes"
              value={formData.notes}
              onChange={(value) => setFormData({ ...formData, notes: value })}
              placeholder="Description..."
            />

            {selectedType?.receiptRequired && (
              <p style={{ margin: 0, color: '#0095FF', fontSize: '0.875rem' }}>
                ⓘ Receipt required for this expense type
              </p>
            )}

            <DxcFlex gap="0.75rem">
              <DxcButton label="Save Expense" onClick={handleSubmitExpense} mode="primary" />
              <DxcButton
                label="Cancel"
                onClick={() => setShowForm(false)}
                mode="secondary"
              />
            </DxcFlex>
          </DxcFlex>
        </DxcCard>
      )}

      {/* Expenses Table */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Expense Entries" />

        <DataTable
          columns={[
            {
              key: 'entryDate',
              header: 'Date',
              render: (row) => formatDate(row.entryDate),
            },
            { key: 'claimNumber', header: 'Claim #' },
            { key: 'expenseDescription', header: 'Type' },
            {
              key: 'quantity',
              header: 'Quantity',
              render: (row) => (row.quantity ? row.quantity : '-'),
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (row) => formatCurrency(row.amount),
            },
            {
              key: 'receiptAttached',
              header: 'Receipt',
              render: (row) => (row.receiptAttached ? '✓' : '-'),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) =>
                row.status === 'DRAFT' ? (
                  <DxcButton
                    label="Delete"
                    mode="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExpense(row.id);
                    }}
                  />
                ) : null,
            },
          ]}
          data={expenses}
          emptyMessage="No expense entries found"
        />
      </DxcCard>
    </DxcFlex>
  );
}
