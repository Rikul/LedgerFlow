import { Injectable } from '@angular/core';
import { Invoice } from '../../features/invoicing/invoice.service';
import { Expense } from '../../features/expenses/expense.service';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  exportDirectory(
    filename: string,
    title: string,
    headers: string[],
    rows: (string | number | boolean | Date | null | undefined)[][],
    options: { subtitle?: string; generatedAt?: Date; emptyMessage?: string } = {}
  ): void {
    if (typeof window === 'undefined') {
      return;
    }

    const generatedAt = options.generatedAt ?? new Date();
    const tableRowsHtml = rows.length
      ? rows
          .map(row => `
            <tr>
              ${row
                .map(cell => `<td>${this.escapeHtml(this.formatDirectoryCell(cell))}</td>`)
                .join('')}
            </tr>
          `)
          .join('')
      : `<tr><td class="empty" colspan="${headers.length}">${this.escapeHtml(options.emptyMessage || 'No records to export.')}</td></tr>`;

    const html = `
      <div class="document">
        <div class="document-header">
          <h1>${this.escapeHtml(title)}</h1>
          <p class="generated-date">Generated ${this.escapeHtml(generatedAt.toLocaleString())}</p>
          ${options.subtitle ? `<p class="subtitle">${this.escapeHtml(options.subtitle)}</p>` : ''}
        </div>
        <div class="section">
          <table class="data-table">
            <thead>
              <tr>
                ${headers.map(header => `<th>${this.escapeHtml(header)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.printHtml(filename, html);
  }

  exportInvoice(invoice: Invoice): void {
    if (typeof window === 'undefined') {
      return;
    }

    const lineItemsHtml = (invoice.lineItems && invoice.lineItems.length)
      ? invoice.lineItems
          .map(item => `
            <tr>
              <td>${this.escapeHtml(item.description)}</td>
              <td class="align-right">${item.quantity ?? 0}</td>
              <td class="align-right">${this.formatCurrency(item.rate)}</td>
              <td class="align-right">${this.formatCurrency((item.quantity ?? 0) * (item.rate ?? 0))}</td>
            </tr>
          `)
          .join('')
      : '<tr><td colspan="4">No line items provided.</td></tr>';

    const notesHtml = invoice.notes
      ? `<div class="section"><h2 class="section-title">Notes</h2><p class="multiline">${this.escapeHtml(invoice.notes)}</p></div>`
      : '';
    const termsHtml = invoice.terms
      ? `<div class="section"><h2 class="section-title">Terms &amp; Conditions</h2><p class="multiline">${this.escapeHtml(invoice.terms)}</p></div>`
      : '';

    const html = `
      <div class="document">
        <h1>Invoice ${this.escapeHtml(invoice.invoiceNumber)}</h1>
        <div class="grid section">
          <div>
            <p class="label">Status</p>
            <p class="value">${this.escapeHtml(invoice.status.toUpperCase())}</p>
          </div>
          <div>
            <p class="label">Issue Date</p>
            <p class="value">${this.formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p class="label">Due Date</p>
            <p class="value">${this.formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p class="label">Payment Terms</p>
            <p class="value">${this.escapeHtml((invoice.paymentTerms || '—').toUpperCase())}</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Customer</h2>
          <p class="value">${this.escapeHtml(invoice.customer?.name || '—')}</p>
          ${invoice.customer?.company ? `<p class="value">${this.escapeHtml(invoice.customer.company)}</p>` : ''}
          ${invoice.customer?.email ? `<p class="value">${this.escapeHtml(invoice.customer.email)}</p>` : ''}
        </div>

        <div class="section">
          <h2 class="section-title">Line Items</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="align-right">Qty</th>
                <th class="align-right">Rate</th>
                <th class="align-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
        </div>

        <div class="section totals">
          <table>
            <tbody>
              <tr><th>Subtotal</th><td class="align-right">${this.formatCurrency(invoice.subtotal)}</td></tr>
              <tr><th>Tax (${invoice.taxRate ?? 0}%)</th><td class="align-right">${this.formatCurrency(invoice.taxTotal)}</td></tr>
              <tr><th>Discount</th><td class="align-right">${this.formatCurrency(invoice.discountTotal)}</td></tr>
              <tr class="total-row"><th>Total</th><td class="align-right">${this.formatCurrency(invoice.total)}</td></tr>
            </tbody>
          </table>
        </div>

        ${notesHtml}
        ${termsHtml}
      </div>
    `;

    this.printHtml(`invoice-${invoice.invoiceNumber || 'details'}`, html);
  }

  exportExpense(expense: Expense): void {
    if (typeof window === 'undefined') {
      return;
    }

    const html = `
      <div class="document">
        <h1>Expense Summary</h1>
        <div class="grid section">
          <div>
            <p class="label">Amount</p>
            <p class="value">${this.formatCurrency(expense.amount)}</p>
          </div>
          <div>
            <p class="label">Date</p>
            <p class="value">${this.formatDate(expense.date)}</p>
          </div>
          <div>
            <p class="label">Category</p>
            <p class="value">${this.escapeHtml(this.formatCategory(expense.type))}</p>
          </div>
          <div>
            <p class="label">Payment Method</p>
            <p class="value">${this.escapeHtml(expense.paymentMethod || '—')}</p>
          </div>
          <div>
            <p class="label">Reference #</p>
            <p class="value">${this.escapeHtml(expense.referenceNumber || '—')}</p>
          </div>
          <div>
            <p class="label">Tax Deductible</p>
            <p class="value">${expense.taxDeductible ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p class="label">Tag</p>
            <p class="value">${this.escapeHtml(expense.tag || '—')}</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Associated Contact</h2>
          ${this.renderAssociation(expense)}
        </div>

        ${expense.description ? `<div class="section"><h2 class="section-title">Description</h2><p class="multiline">${this.escapeHtml(expense.description)}</p></div>` : ''}
      </div>
    `;

    this.printHtml(`expense-${expense.id ?? 'details'}`, html);
  }

  private printHtml(filename: string, bodyHtml: string): void {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);

    const doc = frame.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(frame);
      return;
    }

    doc.open();
    doc.write(`<!doctype html><html><head><title>${this.escapeHtml(filename)}</title>${this.getStyles()}</head><body>${bodyHtml}</body></html>`);
    doc.close();

    const triggerPrint = () => {
      setTimeout(() => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(frame);
        }, 1000);
      }, 250);
    };

    if (frame.contentWindow?.document?.readyState === 'complete') {
      triggerPrint();
    } else {
      frame.onload = triggerPrint;
    }
  }

  private getStyles(): string {
    return `
      <style>
        body { font-family: 'Inter', Arial, sans-serif; color: #111827; margin: 24px; }
        h1 { font-size: 24px; margin-bottom: 16px; }
        h2 { margin: 0; }
        .document { max-width: 720px; margin: 0 auto; }
        .document-header { margin-bottom: 24px; }
        .document-header h1 { margin-bottom: 4px; }
        .generated-date { color: #6b7280; font-size: 12px; margin-bottom: 4px; }
        .subtitle { color: #4b5563; font-size: 13px; margin: 0; }
        .section { margin-bottom: 16px; }
        .section-title { font-size: 16px; margin-bottom: 8px; color: #1f2937; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
        .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .value { font-size: 13px; color: #111827; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: 600; }
        .data-table th { background-color: #111827; color: #ffffff; }
        .data-table tbody tr:nth-child(even) td { background-color: #f9fafb; }
        .data-table .empty { text-align: center; color: #6b7280; font-style: italic; }
        .align-right { text-align: right; }
        .totals table { max-width: 320px; margin-left: auto; }
        .totals th { text-align: left; background-color: transparent; }
        .totals td { text-align: right; }
        .totals .total-row th,
        .totals .total-row td { font-size: 14px; font-weight: 600; border-top: 2px solid #9ca3af; }
        .multiline { white-space: pre-wrap; }
      </style>
    `;
  }

  private renderAssociation(expense: Expense): string {
    const parts: string[] = [];
    if (expense.vendor) {
      parts.push(`
        <div class="association">
          <p class="label">Vendor</p>
          <p class="value">${this.escapeHtml(expense.vendor.name)}</p>
          ${expense.vendor.email ? `<p class="value">${this.escapeHtml(expense.vendor.email)}</p>` : ''}
        </div>
      `);
    }
    if (expense.customer) {
      parts.push(`
        <div class="association">
          <p class="label">Customer</p>
          <p class="value">${this.escapeHtml(expense.customer.name)}</p>
          ${expense.customer.email ? `<p class="value">${this.escapeHtml(expense.customer.email)}</p>` : ''}
        </div>
      `);
    }
    return parts.length ? parts.join('') : '<p class="value">No associated vendor or customer.</p>';
  }

  private formatCurrency(value?: number | null): string {
    const amount = value ?? 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  private formatDate(value?: string | null): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  }

  private formatCategory(value?: string | null): string {
    if (!value) {
      return '—';
    }
    return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private formatDirectoryCell(value: string | number | boolean | Date | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    if (value instanceof Date) {
      const date = value;
      return Number.isNaN(date.getTime()) ? date.toString() : date.toLocaleDateString();
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    const stringValue = String(value).trim();
    return stringValue.length ? stringValue : '—';
  }
}
