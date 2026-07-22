export interface ProductionStep {
  id: number;
  name: string;
  nameId: string; // Indonesian name
  status: 'done' | 'in-progress' | 'qa-hold' | 'pending';
  progress: number;
  startDate?: string;
  endDate?: string;
  workers: string[];
  inspectionLogs: InspectionLog[];
  description?: string;
}

export interface InspectionLog {
  date: string;
  inspector: string;
  result: 'pass' | 'fail' | 'conditional';
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface GanttTask {
  id: string;
  name: string;
  startWeek: number;
  duration: number;
  progress: number;
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  category: string;
}

export interface DrawingRecord {
  id: string;
  code: string;
  name: string;
  version: string;
  status: 'approved' | 'revision' | 'rejected' | 'pending';
  author: string;
  date: string;
  type: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'ordered' | 'shipped' | 'received' | 'inspected' | 'rejected';
  deliveryDate: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  heatNumber: string;
  grade: string;
  thickness: string;
  quantity: number;
  unit: string;
  location: string;
  certificate: string;
  status: 'available' | 'allocated' | 'used' | 'rejected';
}

export interface WeldingRecord {
  id: string;
  wpsNumber: string;
  jointType: string;
  process: string;
  position: string;
  material: string;
  thickness: string;
  status: 'qualified' | 'pending' | 'expired';
}

export interface WelderCertificate {
  id: string;
  welderName: string;
  stampNumber: string;
  process: string;
  position: string;
  validUntil: string;
  status: 'valid' | 'expiring' | 'expired';
  defectRate: number;
}

export interface PaintingRecord {
  id: string;
  area: string;
  coatingSystem: string;
  dft: number;
  targetDft: number;
  batchNumber: string;
  applicator: string;
  date: string;
  status: 'pass' | 'fail' | 'recoat';
}

export interface QAChecklistItem {
  id: string;
  category: string;
  item: string;
  standard: string;
  status: 'approved' | 'rejected' | 'pending';
  inspector?: string;
  date?: string;
  remarks?: string;
}

export interface NDTRecord {
  id: string;
  method: 'RT' | 'UT' | 'MT' | 'PT';
  jointId: string;
  location: string;
  result: 'acceptable' | 'repairable' | 'rejected';
  defectType?: string;
  filmNumber?: string;
  operator: string;
  date: string;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  type: 'certificate' | 'drawing' | 'report' | 'procedure' | 'manual';
  status: 'valid' | 'expired' | 'pending';
  classRef: string;
  date: string;
  size: string;
}

export interface SeaTrialRecord {
  id: string;
  testName: string;
  parameter: string;
  target: string;
  actual: string;
  unit: string;
  status: 'pass' | 'fail' | 'pending';
  date: string;
}
