import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class FileExportService {
  exportToCsv(filename: string, headers: string[], rows: (string | number | boolean | Date | null | undefined)[][]): void {
    const csvRows = [headers, ...rows.map(row => row.map(cell => this.stringifyCell(cell)))]
      .map(row => row.map(value => this.escapeCsv(value)).join(','))
      .join('\r\n');

    this.triggerDownload(filename, csvRows, 'text/csv;charset=utf-8;');
  }

  private stringifyCell(value: string | number | boolean | Date | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  private escapeCsv(value: string): string {
    const needsEscaping = /[",\n\r]/.test(value);
    let escaped = value.replace(/"/g, '""');
    if (needsEscaping) {
      escaped = `"${escaped}"`;
    }
    return escaped;
  }

  private triggerDownload(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
