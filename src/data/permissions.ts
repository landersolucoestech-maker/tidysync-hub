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

export const scheduleVisibilityOptions = [
  { value: "all_days", label: "All Days" },
  { value: "today_tomorrow_6pm", label: "Today + Tomorrow at 6pm" },
  { value: "current_week", label: "Current Week" },
];

export const permissionCategories: PermissionCategory[] = [
  {
    id: "schedule",
    label: "Schedule",
    permissions: [
      { id: "view_schedule", label: "View Schedule", description: "Visualizar agenda completa", type: "toggle" },
      { id: "edit_schedule", label: "Edit Schedule", description: "Editar agenda e jobs", type: "toggle" },
      { id: "toggle_schedule_visibility", label: "Toggle Schedule Visibility", description: "All Days · Today + Tomorrow até 18h · Current Week", type: "dropdown" },
      { id: "start_finish_jobs", label: "Start / Finish Jobs", description: "Iniciar ou finalizar jobs/cleanings", type: "toggle" },
      { id: "view_other_teams_jobs", label: "View Other Teams Jobs", description: "Visualizar jobs de outras equipes", type: "toggle" },
      { id: "view_all_teams", label: "View All Teams", description: "Visualizar todas as equipes", type: "toggle" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    permissions: [
      { id: "view_customers", label: "View Customers", description: "Acessar página de clientes", type: "toggle" },
      { id: "view_customer_contact_info", label: "View Customer Contact Info", description: "Visualizar informações de contato", type: "toggle" },
      { id: "view_customer_charges", label: "View Customer Charges", description: "Visualizar cobranças e faturas do cliente", type: "toggle" },
      { id: "view_customer_chats", label: "View Customer Chats", description: "Ler chats/comunicações", type: "toggle" },
      { id: "view_customer_reviews", label: "View Customer Reviews", description: "Visualizar avaliações", type: "toggle" },
    ],
  },
  {
    id: "prices_payments",
    label: "Prices & Payments",
    permissions: [
      { id: "view_job_prices", label: "View Job Prices", description: "Visualizar preços dos serviços", type: "toggle" },
      { id: "set_job_payments", label: "Set Job Payments", description: "Definir pagamentos dos serviços", type: "toggle" },
      { id: "toggle_hidden_notes", label: "Toggle Hidden Notes", description: "Visualizar / ocultar notas internas", type: "toggle" },
      { id: "toggle_additional_hidden_notes", label: "Toggle Additional Hidden Notes", description: "Visualizar / ocultar informações adicionais", type: "toggle" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    permissions: [
      { id: "view_accounting", label: "View Accounting", description: "Acesso geral ao financeiro", type: "toggle" },
      { id: "edit_payments", label: "Edit Payments", description: "Editar pagamentos", type: "toggle" },
      { id: "view_transactions", label: "View Transactions", description: "Visualizar transações", type: "toggle" },
    ],
  },
  {
    id: "invoices",
    label: "Invoices",
    permissions: [
      { id: "view_invoices", label: "View Invoices", description: "Visualizar faturas", type: "toggle" },
      { id: "create_invoices", label: "Create Invoices", description: "Criar faturas", type: "toggle" },
      { id: "edit_invoices", label: "Edit Invoices", description: "Editar faturas", type: "toggle" },
      { id: "delete_invoices", label: "Delete Invoices", description: "Excluir faturas", type: "toggle" },
      { id: "toggle_invoice_status", label: "Toggle Invoice Status", description: "Enviar · Pago · Vencido", type: "toggle" },
    ],
  },
  {
    id: "leads",
    label: "Leads",
    permissions: [
      { id: "view_leads", label: "View Leads", description: "Visualizar leads", type: "toggle" },
      { id: "create_leads", label: "Create Leads", description: "Criar leads", type: "toggle" },
      { id: "edit_leads", label: "Edit Leads", description: "Editar leads", type: "toggle" },
      { id: "delete_leads", label: "Delete Leads", description: "Excluir leads", type: "toggle" },
    ],
  },
  {
    id: "users",
    label: "Users",
    permissions: [
      { id: "view_users", label: "View Users", description: "Visualizar usuários", type: "toggle" },
      { id: "create_users", label: "Create Users", description: "Criar usuários", type: "toggle" },
      { id: "edit_users", label: "Edit Users", description: "Editar usuários", type: "toggle" },
      { id: "delete_users", label: "Delete Users", description: "Excluir usuários", type: "toggle" },
      { id: "toggle_user_status", label: "Toggle User Status", description: "Ativar / Desativar", type: "toggle" },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    permissions: [
      { id: "view_payroll", label: "View Payroll", description: "Visualizar folha de pagamento", type: "toggle" },
      { id: "create_payroll", label: "Create Payroll", description: "Criar folha de pagamento", type: "toggle" },
      { id: "edit_payroll", label: "Edit Payroll", description: "Editar folha de pagamento", type: "toggle" },
      { id: "delete_payroll", label: "Delete Payroll", description: "Excluir folha de pagamento", type: "toggle" },
      { id: "toggle_payroll_status", label: "Toggle Payroll Status", description: "Pago · Pendente · Bloqueado", type: "toggle" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    permissions: [
      { id: "view_reports", label: "View Reports", description: "Relatórios, métricas e análises", type: "toggle" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    permissions: [
      { id: "view_system_settings", label: "View System Settings", description: "Visualizar configurações do sistema", type: "toggle" },
      { id: "edit_system_settings", label: "Edit System Settings", description: "Editar configurações do sistema", type: "toggle" },
      { id: "view_company_settings", label: "View Company Settings", description: "Visualizar configurações da empresa", type: "toggle" },
      { id: "edit_company_settings", label: "Edit Company Settings", description: "Editar configurações da empresa", type: "toggle" },
      { id: "view_billing_settings", label: "View Billing Settings", description: "Visualizar configurações de cobrança", type: "toggle" },
      { id: "edit_billing_settings", label: "Edit Billing Settings", description: "Planos, assinaturas e pagamentos", type: "toggle" },
      { id: "toggle_billing_status", label: "Toggle Billing Status", description: "Ativar / Suspender assinatura", type: "toggle" },
    ],
  },
];

// Flat list of all permissions for backward compatibility
export const allPermissions = permissionCategories.flatMap(cat => cat.permissions);
