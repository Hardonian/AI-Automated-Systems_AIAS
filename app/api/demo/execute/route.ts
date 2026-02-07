import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data for the demo
    const sourceA = [
      { id: 'ORD-001', amount: 150.0, status: 'paid' },
      { id: 'ORD-002', amount: 200.0, status: 'pending' },
      { id: 'ORD-003', amount: 50.0, status: 'paid' },
    ];

    const sourceB = [
      { id: 'ORD-001', amount: 150.0, status: 'paid' },
      { id: 'ORD-002', amount: 195.0, status: 'paid' }, // Discrepancy
      { id: 'ORD-003', amount: 50.0, status: 'paid' },
    ];

    // Reconciliation logic
    const discrepancies = sourceA.filter(item => {
      const match = sourceB.find(b => b.id === item.id);
      return (
        !match || match.amount !== item.amount || match.status !== item.status
      );
    });

    const summary = `
# Executive Summary: Data Reconciliation Run

## Overview
The agent successfully executed the reconciliation workflow between **Source A (ERP)** and **Source B (Payment Gateway)**.

## Results
- **Total Records Scanned:** ${sourceA.length}
- **Matches Found:** ${sourceA.length - discrepancies.length}
- **Discrepancies Identified:** ${discrepancies.length}

## Key Findings
${
  discrepancies.length > 0
    ? `⚠️ **Discrepancy found in ORD-002:** Source A shows $200.00 (pending), while Source B shows $195.00 (paid).`
    : '✅ All records match perfectly.'
}

## Why Not Automate Further?
While we identified the discrepancy, we have **not** automatically updated Source A. 
**Reason:** The price difference ($5.00) exceeds the auto-reconciliation threshold of $1.00. 
**Action Required:** Manual review by the finance team is recommended to ensure no fraudulent activity or systemic rounding errors.
    `.trim();

    const evidence = {
      run_id: `demo-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      sources: {
        a: 'erp_system_v2',
        b: 'stripe_gateway_prod',
      },
      discrepancies: discrepancies.map(d => ({
        id: d.id,
        expected: d.amount,
        actual: sourceB.find(b => b.id === d.id)?.amount,
        diff: d.amount - (sourceB.find(b => b.id === d.id)?.amount || 0),
      })),
      threshold_check: {
        passed: false,
        limit: 1.0,
        detected_max_diff: 5.0,
      },
    };

    return NextResponse.json({ summary, evidence });
  } catch (error) {
    console.error('Demo execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute demo workflow' },
      { status: 500 }
    );
  }
}
