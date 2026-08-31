export type PrescriptionStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface Prescription {
  id: string;
  userId: string;
  fileUrl: string;
  fileType: 'image' | 'pdf';
  status: PrescriptionStatus;
  createdAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}
