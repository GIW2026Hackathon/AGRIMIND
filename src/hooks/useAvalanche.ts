"use client";

/**
 * Avalanche Trust Layer — React Hook
 * Single hook for all Avalanche data fetching.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  NetworkStatus, SupplyChainBatch, CropVerification,
  FarmerIdentity, CarbonCredit, ContractEvent, WalletState,
} from '../types/avalanche';
import * as avalancheService from '../services/avalancheService';

interface AvalancheState {
  network: NetworkStatus | null;
  supplyChain: SupplyChainBatch[];
  cropVerification: CropVerification | null;
  farmer: FarmerIdentity | null;
  carbonCredits: CarbonCredit | null;
  events: ContractEvent[];
  wallet: WalletState | null;
  loading: {
    network: boolean; supplyChain: boolean; crop: boolean; farmer: boolean;
    carbon: boolean; events: boolean; wallet: boolean; action: boolean;
  };
  errors: {
    network: string | null; supplyChain: string | null; crop: string | null;
    farmer: string | null; carbon: string | null; events: string | null; wallet: string | null;
  };
}

const initialLoading = { network: true, supplyChain: true, crop: true, farmer: true, carbon: true, events: true, wallet: false, action: false };
const initialErrors = { network: null, supplyChain: null, crop: null, farmer: null, carbon: null, events: null, wallet: null };

export function useAvalanche() {
  const [state, setState] = useState<AvalancheState>({
    network: null, supplyChain: [], cropVerification: null, farmer: null,
    carbonCredits: null, events: [], wallet: null,
    loading: initialLoading, errors: initialErrors,
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = useCallback(async () => {
    setState(s => ({ ...s, loading: initialLoading }));
    try {
      const [network, supplyChain, crop, farmer, carbon, events] = await Promise.all([
        avalancheService.getNetworkStatus(),
        avalancheService.getSupplyChain(),
        avalancheService.getCropVerification(),
        avalancheService.getFarmerIdentity(),
        avalancheService.getCarbonCredits(),
        avalancheService.getContractEvents(),
      ]);
      setState(s => ({
        ...s, network, supplyChain, cropVerification: crop, farmer,
        carbonCredits: carbon, events,
        loading: { network: false, supplyChain: false, crop: false, farmer: false, carbon: false, events: false, wallet: false, action: false },
      }));
    } catch (err) {
      setState(s => ({
        ...s,
        errors: { ...initialErrors, network: err instanceof Error ? err.message : 'Failed to load data' },
        loading: { network: false, supplyChain: false, crop: false, farmer: false, carbon: false, events: false, wallet: false, action: false },
      }));
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setState(s => ({ ...s, loading: { ...s.loading, wallet: true } }));
    try {
      const wallet = await avalancheService.connectWallet();
      setState(s => ({ ...s, wallet, loading: { ...s.loading, wallet: false } }));
      return wallet;
    } catch (err) {
      setState(s => ({ ...s, errors: { ...s.errors, wallet: err instanceof Error ? err.message : 'Connection failed' }, loading: { ...s.loading, wallet: false } }));
      return null;
    }
  }, []);

  const verifyHarvest = useCallback(async (batchId: string) => {
    setState(s => ({ ...s, loading: { ...s.loading, action: true } }));
    try {
      const result = await avalancheService.verifyHarvest(batchId);
      await fetchAll();
      setState(s => ({ ...s, loading: { ...s.loading, action: false } }));
      return result;
    } catch (err) {
      setState(s => ({ ...s, loading: { ...s.loading, action: false } }));
      throw err;
    }
  }, [fetchAll]);

  const refresh = useCallback(() => { fetchAll(); }, [fetchAll]);

  return {
    ...state, connectWallet, verifyHarvest, refresh,
    formatAddress: avalancheService.formatAddress,
    getExplorerUrl: avalancheService.getExplorerUrl,
  };
}