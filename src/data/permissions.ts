// ============================================
// RBAC Permission System - CleanPro SaaS
// Pattern: view_ · create_ · edit_ · delete_ · toggle_
// ============================================

export interface Permission {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "dropdown";
}

export interface PermissionCategory {
  id: string;
  label: string;
  permissions: Permission[];
}

// Schedule visibility options for dropdown
export const scheduleVisibilityOptions = [
  { value: "all_days", label: "All Days" },
  { value: "today_tomorrow_6pm", label: "Today + Tomorrow at 6pm" },
  { value: "current_week", label: "Current Week" },
];

// ============================================
// PERMISSION CATEGORIES
// ============================================

export const permissionCategories: PermissionCategory[] = [
  // ─────────────────────────────────────────
  // SCHEDULE
  // ─────────────────────────────────────────
  {
    id: "schedule",
    label: "Schedule",
    permissions: [
      { id: "view_schedule", label: "View Schedule", description: "Visualizar agenda completa", type: "toggle" },
      { id: "create_schedule", label: "Create Schedule", description: "Criar agendamentos e jobs", type: "toggle" },
      { id: "edit_schedule", label: "Edit Schedule", description: "Editar agendamentos e jobs", type: "toggle" },
      { id: "delete_schedule", label: "Delete Schedule", description: "Excluir agendamentos e jobs", type: "toggle" },
      { id: "toggle_schedule_visibility", label: "Toggle Schedule Visibility", description: "Controlar visibilidade: All Days · Today + Tomorrow · Current Week", type: "dropdown" },
      { id: "toggle_job_status", label: "Toggle Job Status", description: "Iniciar / Finalizar / Pausar jobs", type: "toggle" },
      { id: "view_other_teams_jobs", label: "View Other Teams Jobs", description: "Visualizar jobs de outras equipes", type: "toggle" },
      { id: "view_all_teams", label: "View All Teams", description: "Visualizar todas as equipes", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // CUSTOMERS
  // ─────────────────────────────────────────
  {
    id: "customers",
    label: "Customers",
    permissions: [
      { id: "view_customers", label: "View Customers", description: "Visualizar lista de clientes", type: "toggle" },
      { id: "create_customers", label: "Create Customers", description: "Criar novos clientes", type: "toggle" },
      { id: "edit_customers", label: "Edit Customers", description: "Editar dados de clientes", type: "toggle" },
      { id: "delete_customers", label: "Delete Customers", description: "Excluir clientes", type: "toggle" },
      { id: "view_customer_contact", label: "View Customer Contact", description: "Visualizar telefone, email, endereço", type: "toggle" },
      { id: "view_customer_charges", label: "View Customer Charges", description: "Visualizar cobranças e faturas do cliente", type: "toggle" },
      { id: "view_customer_history", label: "View Customer History", description: "Visualizar histórico de serviços", type: "toggle" },
      { id: "view_customer_reviews", label: "View Customer Reviews", description: "Visualizar avaliações do cliente", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // COMMUNICATIONS
  // ─────────────────────────────────────────
  {
    id: "communications",
    label: "Communications",
    permissions: [
      { id: "view_communications", label: "View Communications", description: "Visualizar mensagens e conversas", type: "toggle" },
      { id: "create_messages", label: "Create Messages", description: "Enviar novas mensagens", type: "toggle" },
      { id: "delete_messages", label: "Delete Messages", description: "Excluir mensagens", type: "toggle" },
      { id: "toggle_conversation_status", label: "Toggle Conversation Status", description: "Arquivar / Marcar como lida / Favoritar", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // JOBS / PRICES & PAYMENTS
  // ─────────────────────────────────────────
  {
    id: "prices_payments",
    label: "Prices & Payments",
    permissions: [
      { id: "view_job_prices", label: "View Job Prices", description: "Visualizar preços dos serviços", type: "toggle" },
      { id: "edit_job_prices", label: "Edit Job Prices", description: "Editar preços dos serviços", type: "toggle" },
      { id: "view_job_payments", label: "View Job Payments", description: "Visualizar pagamentos dos jobs", type: "toggle" },
      { id: "edit_job_payments", label: "Edit Job Payments", description: "Editar pagamentos dos jobs", type: "toggle" },
      { id: "toggle_hidden_notes", label: "Toggle Hidden Notes", description: "Visualizar / ocultar notas internas", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // ACCOUNTING / TRANSACTIONS
  // ─────────────────────────────────────────
  {
    id: "accounting",
    label: "Accounting",
    permissions: [
      { id: "view_transactions", label: "View Transactions", description: "Visualizar transações financeiras", type: "toggle" },
      { id: "create_transactions", label: "Create Transactions", description: "Criar transações (receitas/despesas)", type: "toggle" },
      { id: "edit_transactions", label: "Edit Transactions", description: "Editar transações", type: "toggle" },
      { id: "delete_transactions", label: "Delete Transactions", description: "Excluir transações", type: "toggle" },
      { id: "toggle_transaction_status", label: "Toggle Transaction Status", description: "Confirmar / Cancelar / Pendente", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // INVOICES
  // ─────────────────────────────────────────
  {
    id: "invoices",
    label: "Invoices",
    permissions: [
      { id: "view_invoices", label: "View Invoices", description: "Visualizar faturas", type: "toggle" },
      { id: "create_invoices", label: "Create Invoices", description: "Criar novas faturas", type: "toggle" },
      { id: "edit_invoices", label: "Edit Invoices", description: "Editar faturas existentes", type: "toggle" },
      { id: "delete_invoices", label: "Delete Invoices", description: "Excluir faturas", type: "toggle" },
      { id: "toggle_invoice_status", label: "Toggle Invoice Status", description: "Enviar / Pago / Vencido / Cancelado", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // LEADS / ESTIMATES
  // ─────────────────────────────────────────
  {
    id: "leads",
    label: "Leads",
    permissions: [
      { id: "view_leads", label: "View Leads", description: "Visualizar leads e orçamentos", type: "toggle" },
      { id: "create_leads", label: "Create Leads", description: "Criar novos leads/orçamentos", type: "toggle" },
      { id: "edit_leads", label: "Edit Leads", description: "Editar leads/orçamentos", type: "toggle" },
      { id: "delete_leads", label: "Delete Leads", description: "Excluir leads/orçamentos", type: "toggle" },
      { id: "toggle_lead_status", label: "Toggle Lead Status", description: "Aprovar / Rejeitar / Pendente", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // USERS / TEAM
  // ─────────────────────────────────────────
  {
    id: "users",
    label: "Users",
    permissions: [
      { id: "view_users", label: "View Users", description: "Visualizar lista de usuários", type: "toggle" },
      { id: "create_users", label: "Create Users", description: "Criar novos usuários", type: "toggle" },
      { id: "edit_users", label: "Edit Users", description: "Editar dados de usuários", type: "toggle" },
      { id: "delete_users", label: "Delete Users", description: "Excluir usuários", type: "toggle" },
      { id: "toggle_user_status", label: "Toggle User Status", description: "Ativar / Desativar / Suspender", type: "toggle" },
      { id: "view_user_roles", label: "View User Roles", description: "Visualizar funções e permissões", type: "toggle" },
      { id: "edit_user_roles", label: "Edit User Roles", description: "Atribuir funções e permissões", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // PAYROLL
  // ─────────────────────────────────────────
  {
    id: "payroll",
    label: "Payroll",
    permissions: [
      { id: "view_payroll", label: "View Payroll", description: "Visualizar folha de pagamento", type: "toggle" },
      { id: "create_payroll", label: "Create Payroll", description: "Criar registros de pagamento", type: "toggle" },
      { id: "edit_payroll", label: "Edit Payroll", description: "Editar registros de pagamento", type: "toggle" },
      { id: "delete_payroll", label: "Delete Payroll", description: "Excluir registros de pagamento", type: "toggle" },
      { id: "toggle_payroll_status", label: "Toggle Payroll Status", description: "Pago / Pendente / Cancelado", type: "toggle" },
      { id: "view_payroll_rules", label: "View Payroll Rules", description: "Visualizar regras de cálculo", type: "toggle" },
      { id: "edit_payroll_rules", label: "Edit Payroll Rules", description: "Editar regras de cálculo", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // REPORTS
  // ─────────────────────────────────────────
  {
    id: "reports",
    label: "Reports",
    permissions: [
      { id: "view_reports", label: "View Reports", description: "Visualizar relatórios gerais", type: "toggle" },
      { id: "view_financial_reports", label: "View Financial Reports", description: "Visualizar relatórios financeiros", type: "toggle" },
      { id: "view_team_reports", label: "View Team Reports", description: "Visualizar relatórios de equipe", type: "toggle" },
      { id: "export_reports", label: "Export Reports", description: "Exportar relatórios (PDF, Excel)", type: "toggle" },
    ],
  },

  // ─────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────
  {
    id: "settings",
    label: "Settings",
    permissions: [
      // System Settings
      { id: "view_system_settings", label: "View System Settings", description: "Visualizar configurações do sistema", type: "toggle" },
      { id: "edit_system_settings", label: "Edit System Settings", description: "Editar configurações do sistema", type: "toggle" },
      // Company Settings
      { id: "view_company_settings", label: "View Company Settings", description: "Visualizar dados da empresa", type: "toggle" },
      { id: "edit_company_settings", label: "Edit Company Settings", description: "Editar dados da empresa", type: "toggle" },
      // Billing Settings
      { id: "view_billing_settings", label: "View Billing Settings", description: "Visualizar planos e assinaturas", type: "toggle" },
      { id: "edit_billing_settings", label: "Edit Billing Settings", description: "Gerenciar planos e pagamentos", type: "toggle" },
      { id: "toggle_billing_status", label: "Toggle Billing Status", description: "Ativar / Suspender assinatura", type: "toggle" },
      // Integrations
      { id: "view_integrations", label: "View Integrations", description: "Visualizar integrações", type: "toggle" },
      { id: "edit_integrations", label: "Edit Integrations", description: "Configurar integrações", type: "toggle" },
    ],
  },
];

// ============================================
// UTILITY EXPORTS
// ============================================

// Flat list of all permissions
export const allPermissions = permissionCategories.flatMap(cat => cat.permissions);

// Get all permission IDs as a type
export type PermissionId = typeof allPermissions[number]["id"];

// Permission lookup map for O(1) access
export const permissionMap = new Map(
  allPermissions.map(p => [p.id, p])
);

// Get category by permission ID
export const getCategoryByPermission = (permissionId: string): PermissionCategory | undefined => {
  return permissionCategories.find(cat => 
    cat.permissions.some(p => p.id === permissionId)
  );
};
