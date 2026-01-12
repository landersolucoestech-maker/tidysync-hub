import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompanyBilling, BillingInvoice, PaymentMethod, PlanType } from "./types";

// ============================================
// PLAN FEATURES - Feature Gating
// ============================================

export interface PlanFeatures {
  seats: number;
  jobs_per_month: number;
  customers: number;
  storage_gb: number;
  integrations: boolean;
  automations: boolean;
  custom_templates: boolean;
  api_access: boolean;
  priority_support: boolean;
  white_label: boolean;
  custom_roles: boolean;
  audit_logs: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    seats: 1,
    jobs_per_month: 50,
    customers: 100,
    storage_gb: 1,
    integrations: false,
    automations: false,
    custom_templates: false,
    api_access: false,
    priority_support: false,
    white_label: false,
    custom_roles: false,
    audit_logs: false,
  },
  starter: {
    seats: 3,
    jobs_per_month: 200,
    customers: 500,
    storage_gb: 5,
    integrations: true,
    automations: false,
    custom_templates: true,
    api_access: false,
    priority_support: false,
    white_label: false,
    custom_roles: false,
    audit_logs: false,
  },
  professional: {
    seats: 10,
    jobs_per_month: -1, // unlimited
    customers: -1,
    storage_gb: 25,
    integrations: true,
    automations: true,
    custom_templates: true,
    api_access: true,
    priority_support: true,
    white_label: false,
    custom_roles: true,
    audit_logs: true,
  },
  enterprise: {
    seats: -1, // unlimited
    jobs_per_month: -1,
    customers: -1,
    storage_gb: -1,
    integrations: true,
    automations: true,
    custom_templates: true,
    api_access: true,
    priority_support: true,
    white_label: true,
    custom_roles: true,
    audit_logs: true,
  },
};

export const PLAN_PRICES: Record<PlanType, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  starter: { monthly: 29, yearly: 290 },
  professional: { monthly: 79, yearly: 790 },
  enterprise: { monthly: 199, yearly: 1990 },
};

// ============================================
// BILLING STORE
// ============================================

interface BillingState {
  billing: CompanyBilling | null;
  invoices: BillingInvoice[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;

  // Actions
  setBilling: (billing: CompanyBilling | null) => void;
  setInvoices: (invoices: BillingInvoice[]) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  updatePlan: (plan: PlanType, cycle: "monthly" | "yearly") => void;
  
  // Feature checks
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  getFeatureLimit: (feature: keyof PlanFeatures) => number | boolean;
  canAddSeat: () => boolean;
  getSeatsRemaining: () => number;
  
  setLoading: (loading: boolean) => void;
}

const defaultBilling: CompanyBilling = {
  id: "billing_1",
  company_id: "company_1",
  plan: "professional",
  seats: 10,
  seats_used: 3,
  billing_cycle: "monthly",
  status: "active",
  next_charge_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  amount: 79,
  currency: "USD",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    company_id: "company_1",
    type: "credit_card",
    last4: "4242",
    expiry_date: "12/25",
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "pm_2",
    company_id: "company_1",
    type: "bank_account",
    last4: "6789",
    bank_name: "Chase Bank",
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

const defaultInvoices: BillingInvoice[] = [
  {
    id: "inv_1",
    company_id: "company_1",
    invoice_number: "INV-2024-001",
    amount: 79,
    currency: "USD",
    status: "paid",
    due_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    paid_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "inv_2",
    company_id: "company_1",
    invoice_number: "INV-2024-002",
    amount: 79,
    currency: "USD",
    status: "sent",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      billing: defaultBilling,
      invoices: defaultInvoices,
      paymentMethods: defaultPaymentMethods,
      isLoading: false,

      setBilling: (billing) => set({ billing }),

      setInvoices: (invoices) => set({ invoices }),

      setPaymentMethods: (methods) => set({ paymentMethods: methods }),

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method],
        })),

      removePaymentMethod: (methodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
        })),

      setDefaultPaymentMethod: (methodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) => ({
            ...m,
            is_default: m.id === methodId,
          })),
        })),

      updatePlan: (plan, cycle) =>
        set((state) => ({
          billing: state.billing
            ? {
                ...state.billing,
                plan,
                billing_cycle: cycle,
                seats: PLAN_FEATURES[plan].seats,
                amount: PLAN_PRICES[plan][cycle],
                updated_at: new Date().toISOString(),
              }
            : null,
        })),

      hasFeature: (feature) => {
        const { billing } = get();
        if (!billing) return false;
        const featureValue = PLAN_FEATURES[billing.plan][feature];
        if (typeof featureValue === "boolean") return featureValue;
        return featureValue !== 0;
      },

      getFeatureLimit: (feature) => {
        const { billing } = get();
        if (!billing) return false;
        return PLAN_FEATURES[billing.plan][feature];
      },

      canAddSeat: () => {
        const { billing } = get();
        if (!billing) return false;
        const maxSeats = PLAN_FEATURES[billing.plan].seats;
        if (maxSeats === -1) return true; // unlimited
        return billing.seats_used < maxSeats;
      },

      getSeatsRemaining: () => {
        const { billing } = get();
        if (!billing) return 0;
        const maxSeats = PLAN_FEATURES[billing.plan].seats;
        if (maxSeats === -1) return 999; // unlimited
        return maxSeats - billing.seats_used;
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "billing-storage",
      partialize: (state) => ({
        billing: state.billing,
        paymentMethods: state.paymentMethods,
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const useBilling = () => useBillingStore((state) => state.billing);
export const useInvoices = () => useBillingStore((state) => state.invoices);
export const usePaymentMethods = () => useBillingStore((state) => state.paymentMethods);
export const useCurrentPlan = () => useBillingStore((state) => state.billing?.plan);
export const useBillingLoading = () => useBillingStore((state) => state.isLoading);
