/**
 * Avalanche Trust Layer — Type Definitions
 * All types for the blockchain verification module
 */

export interface NetworkStatus {
  network: string;
  chainId: number;
  status: 'connected' | 'disconnected' | 'connecting';
  verifiedRecords: number;
  smartContractsActive: number;
  latestBlock: number;
  recentVerification: string;
  gasPrice: string;
  blockTime: string;
}

export interface SupplyChainStage {
  id: string;
  name: string;
  icon: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
  verified: boolean;
  txHash?: string;
  actor: string;
  location: string;
  details?: string;
}

export interface SupplyChainBatch {
  batchId: string;
  crop: string;
  stages: SupplyChainStage[];
  overallStatus: 'verified' | 'in-progress' | 'pending';
  createdAt: string;
}

export interface CropVerification {
  batchId: string;
  crop: string;
  variety: string;
  farmer: string;
  farmerId: string;
  harvestDate: string;
  location: string;
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  weight: string;
  blockchainStatus: 'verified' | 'pending' | 'failed';
  transactionHash: string;
  blockNumber: number;
  verifiedAt: string;
  network: string;
  certificateId: string;
  inspections: InspectionRecord[];
}

export interface InspectionRecord {
  date: string;
  inspector: string;
  result: 'pass' | 'fail' | 'conditional';
  notes: string;
}

export interface FarmerIdentity {
  id: string;
  name: string;
  location: string;
  avatar: string;
  reputationScore: number;
  trustScore: number;
  harvestHistory: number;
  completedTransactions: number;
  yearsActive: number;
  blockchainAddress: string;
  certifications: string[];
  isVerified: boolean;
  verificationDate: string;
  rating: number;
}

export interface CarbonCredit {
  id: string;
  farmerId: string;
  carbonSaved: number;
  treesEquivalent: number;
  emissionReduction: number;
  creditsEarned: number;
  status: 'verified' | 'pending' | 'claimed';
  verifiedAt: string;
  methodology: string;
  period: string;
  blockchainTx: string;
  milestones: CarbonMilestone[];
}

export interface CarbonMilestone {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}

export interface ContractEvent {
  id: string;
  type: 'harvest' | 'verification' | 'payment' | 'transport' | 'certificate' | 'identity' | 'carbon';
  title: string;
  description: string;
  timestamp: string;
  txHash: string;
  blockNumber: number;
  status: 'success' | 'pending' | 'failed';
  actor: string;
  icon: string;
  color: string;
}

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}