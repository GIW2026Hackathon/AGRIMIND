/**
 * Avalanche Trust Layer — Service Layer
 * 
 * All blockchain interactions are mocked for the hackathon demo.
 * Replace mock implementations with real Avalanche RPC calls
 * by uncommenting the RPC sections and removing mock returns.
 * 
 * Architecture: This is the ONLY file that needs to change for production.
 */

import {
  NetworkStatus, SupplyChainBatch, CropVerification,
  FarmerIdentity, CarbonCredit, ContractEvent, WalletState,
} from '../types/avalanche';

const AVALANCHE_CONFIG = {
  fuji: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://testnet.snowtrace.io',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  },
};

const MOCK_NETWORK: NetworkStatus = {
  network: 'Avalanche Fuji Testnet',
  chainId: 43113,
  status: 'connected',
  verifiedRecords: 1284,
  smartContractsActive: 6,
  latestBlock: 28473921,
  recentVerification: '2 minutes ago',
  gasPrice: '25 nAVAX',
  blockTime: '2.1s',
};

const MOCK_SUPPLY_CHAIN: SupplyChainBatch[] = [
  {
    batchId: 'BATCH-2026-004891',
    crop: 'Tomatoes',
    overallStatus: 'verified',
    createdAt: '2026-06-20T06:30:00Z',
    stages: [
      { id: 'harvest', name: 'Harvest', icon: '🌱', timestamp: '2026-06-20 06:30', status: 'completed', verified: true, txHash: '0x7a3f...9e2d', actor: 'John Kamau', location: 'Nakuru, Kenya', details: '3.2 ha · Cal-J variety · 2,400 kg' },
      { id: 'batch', name: 'Batch Created', icon: '📦', timestamp: '2026-06-20 08:15', status: 'completed', verified: true, txHash: '0x8b4c...1f3a', actor: 'AgriMind System', location: 'Nakuru Collection Center', details: 'Quality grade: A+ · Batch ID assigned' },
      { id: 'transport', name: 'Transport', icon: '🚚', timestamp: '2026-06-20 10:45', status: 'completed', verified: true, txHash: '0x9d5e...2g4b', actor: 'Cold Chain Logistics', location: 'Nakuru → Nairobi', details: 'Refrigerated transport · 156 km · 4.2h' },
      { id: 'market', name: 'Market', icon: '🏪', timestamp: '2026-06-20 15:20', status: 'completed', verified: true, txHash: '0xae6f...3h5c', actor: 'Wakulima Market', location: 'Nairobi, Kenya', details: 'Received · Quality confirmed · Listed' },
      { id: 'buyer', name: 'Buyer', icon: '🛒', timestamp: '2026-06-20 16:45', status: 'completed', verified: true, txHash: '0xbf7g...4i6d', actor: 'FreshMart Supermarkets', location: 'Nairobi, Kenya', details: 'Purchased · KSh 45/kg · 2,400 kg' },
      { id: 'verified', name: 'Verified on Avalanche', icon: '✅', timestamp: '2026-06-20 17:02', status: 'completed', verified: true, txHash: '0xcg8h...5j7e', actor: 'Avalanche Network', location: 'Blockchain', details: 'Full chain verified · Certificate issued' },
    ],
  },
];

const MOCK_CROP_VERIFICATION: CropVerification = {
  batchId: 'BATCH-2026-004891',
  crop: 'Tomatoes',
  variety: 'Cal-J',
  farmer: 'John Kamau',
  farmerId: 'FARMER-KE-001',
  harvestDate: '2026-06-20',
  location: 'Nakuru, Kenya',
  qualityGrade: 'A+',
  weight: '2,400 kg',
  blockchainStatus: 'verified',
  transactionHash: '0xcg8h5j7e2k9l1m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
  blockNumber: 28473921,
  verifiedAt: '2026-06-20T17:02:14Z',
  network: 'Avalanche Fuji Testnet',
  certificateId: 'CERT-AVAX-2026-004891',
  inspections: [
    { date: '2026-06-20', inspector: 'AgriMind AI', result: 'pass', notes: 'Visual analysis: no defects, optimal color, firmness 8.2/10' },
    { date: '2026-06-20', inspector: 'Field Agent M. Njoroge', result: 'pass', notes: 'Manual inspection: size uniform, no pest damage, Brix 5.2°' },
    { date: '2026-06-20', inspector: 'Cold Chain Monitor', result: 'pass', notes: 'Temperature maintained 4-8°C throughout transport' },
  ],
};

const MOCK_FARMER: FarmerIdentity = {
  id: 'FARMER-KE-001',
  name: 'John Kamau',
  location: 'Nakuru, Kenya',
  avatar: '👨‍🌾',
  reputationScore: 94,
  trustScore: 97,
  harvestHistory: 47,
  completedTransactions: 38,
  yearsActive: 6,
  blockchainAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  certifications: ['Organic Certified', 'GlobalGAP', 'Fair Trade'],
  isVerified: true,
  verificationDate: '2024-03-15',
  rating: 4.8,
};

const MOCK_CARBON: CarbonCredit = {
  id: 'CARBON-2026-KE-0891',
  farmerId: 'FARMER-KE-001',
  carbonSaved: 12480,
  treesEquivalent: 568,
  emissionReduction: 34,
  creditsEarned: 12.48,
  status: 'verified',
  verifiedAt: '2026-06-01T00:00:00Z',
  methodology: 'Sustainable Farming Practices v2.1',
  period: 'Jan 2026 – Jun 2026',
  blockchainTx: '0xd2e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e',
  milestones: [
    { label: 'Carbon Saved', value: 12480, target: 15000, unit: 'kg CO₂', color: '#22c55e' },
    { label: 'Trees Equivalent', value: 568, target: 700, unit: 'trees', color: '#16a34a' },
    { label: 'Emission Reduction', value: 34, target: 50, unit: '%', color: '#84cc16' },
    { label: 'Credits Earned', value: 12.48, target: 15.0, unit: 'tCO₂e', color: '#4ade80' },
  ],
};

const MOCK_EVENTS: ContractEvent[] = [
  { id: 'evt-001', type: 'certificate', title: 'Certificate Issued', description: 'Verification certificate BATCH-2026-004891 minted on Avalanche', timestamp: '2026-06-20T17:02:14Z', txHash: '0xcg8h...5j7e', blockNumber: 28473921, status: 'success', actor: 'AgriMind Trust Layer', icon: '📜', color: '#22c55e' },
  { id: 'evt-002', type: 'payment', title: 'Payment Released', description: 'KSh 108,000 released to John Kamau via smart contract escrow', timestamp: '2026-06-20T16:45:00Z', txHash: '0xbf7g...4i6d', blockNumber: 28473895, status: 'success', actor: 'FreshMart Supermarkets', icon: '💰', color: '#f59e0b' },
  { id: 'evt-003', type: 'verification', title: 'Buyer Verified', description: 'FreshMart identity and payment capability confirmed on-chain', timestamp: '2026-06-20T16:40:00Z', txHash: '0xbe6f...3h5c', blockNumber: 28473888, status: 'success', actor: 'Avalanche Identity Service', icon: '✓', color: '#3b82f6' },
  { id: 'evt-004', type: 'transport', title: 'Transport Logged', description: 'Cold chain IoT data anchored: 4.2h · 156km · avg 6.1°C', timestamp: '2026-06-20T10:45:00Z', txHash: '0x9d5e...2g4b', blockNumber: 28473512, status: 'success', actor: 'Cold Chain Logistics', icon: '🚚', color: '#14b8a6' },
  { id: 'evt-005', type: 'harvest', title: 'Harvest Registered', description: '2,400 kg tomatoes registered by John Kamau at Kamau Farm', timestamp: '2026-06-20T06:30:00Z', txHash: '0x7a3f...9e2d', blockNumber: 28473201, status: 'success', actor: 'John Kamau', icon: '🌱', color: '#22c55e' },
  { id: 'evt-006', type: 'carbon', title: 'Carbon Credits Verified', description: '12.48 tCO₂e credits verified for sustainable farming period', timestamp: '2026-06-01T00:00:00Z', txHash: '0xd2e9...1d0e', blockNumber: 28410234, status: 'success', actor: 'Verra Carbon Standard', icon: '🌍', color: '#84cc16' },
];

export async function connectWallet(): Promise<WalletState> {
  await new Promise(r => setTimeout(r, 1200));
  return { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', balance: '2.45 AVAX', isConnected: true, isConnecting: false, error: null };
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  await new Promise(r => setTimeout(r, 400));
  return { ...MOCK_NETWORK, latestBlock: MOCK_NETWORK.latestBlock + Math.floor(Math.random() * 5) };
}

export async function verifyHarvest(batchId: string): Promise<{ success: boolean; txHash: string }> {
  await new Promise(r => setTimeout(r, 2500));
  const txHash = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  return { success: true, txHash };
}

export async function createBatch(crop: string, farmer: string, quantity: number, location: string): Promise<{ success: boolean; batchId: string; txHash: string }> {
  await new Promise(r => setTimeout(r, 2000));
  const batchId = `BATCH-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const txHash = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  return { success: true, batchId, txHash };
}

export async function verifyFarmer(farmerId: string): Promise<{ success: boolean; txHash: string }> {
  await new Promise(r => setTimeout(r, 1800));
  const txHash = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  return { success: true, txHash };
}

export async function getTransaction(txHash: string): Promise<{ hash: string; blockNumber: number; timestamp: string; from: string; to: string; gasUsed: string; status: 'success' | 'failed' }> {
  await new Promise(r => setTimeout(r, 600));
  return { hash: txHash, blockNumber: 28473921, timestamp: '2026-06-20T17:02:14Z', from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', to: AVALANCHE_CONFIG.fuji.contractAddress, gasUsed: '124,532', status: 'success' };
}

export async function getSupplyChain(batchId?: string): Promise<SupplyChainBatch[]> {
  await new Promise(r => setTimeout(r, 500));
  return MOCK_SUPPLY_CHAIN;
}

export async function getCropVerification(batchId?: string): Promise<CropVerification> {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_CROP_VERIFICATION;
}

export async function getFarmerIdentity(farmerId?: string): Promise<FarmerIdentity> {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_FARMER;
}

export async function getCarbonCredits(farmerId?: string): Promise<CarbonCredit> {
  await new Promise(r => setTimeout(r, 500));
  return MOCK_CARBON;
}

export async function getContractEvents(limit = 20): Promise<ContractEvent[]> {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_EVENTS.slice(0, limit);
}

export function getExplorerUrl(txHash: string): string {
  return `${AVALANCHE_CONFIG.fuji.explorerUrl}/tx/${txHash}`;
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}