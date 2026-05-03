export type ReportType = 'ASSORT' | 'SOLID';

export interface SizeRatio {
  id: string;
  size: string;
  ratio: number;
}

export interface ReportSection {
  id: string;
  poNumber: string;
  cartonQty: number;
  startCartonNo: number;
  sizeRatios: SizeRatio[];
}

export interface ReportData {
  type: ReportType;
  companyName: string;
  address: string;
  buyerName: string;
  style: string;
  color: string;
  // For Assort (Legacy support / Flat structure)
  poNumber: string;
  cartonQty: number;
  sizeRatios: SizeRatio[];
  // For Solid / Multi-section
  sections: ReportSection[];
}
