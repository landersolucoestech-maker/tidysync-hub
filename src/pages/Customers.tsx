import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, UserPlus, Users, UserCheck, UserX, Repeat, Eye, Pencil, Trash2, LayoutGrid, List, Phone, Mail, MapPin } from "lucide-react";
import { CustomerModal } from "@/components/customers/CustomerModal";
import { CustomerDetailsModal } from "@/components/customers/CustomerDetailsModal";
const customers = [{
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.j@email.com",
  phone: "(555) 123-4567",
  phone2: "(555) 234-5678",
  address: "123 Oak Street, Springfield",
  addresses: [{
    name: "Home",
    address: "123 Oak Street, Springfield",
    notes: "Gate code: 1234. Ring doorbell twice."
  }, {
    name: "Work",
    address: "456 Corporate Blvd, Springfield",
    notes: "Park in visitor lot. Check in at front desk."
  }],
  status: "Active",
  lastService: "2024-01-10",
  totalJobs: 24,
  revenue: "$2,400",
  rating: 5,
  frequency: "Weekly",
  preferredDay: "Monday",
  paymentMethod: "QuickBooks",
  customerSince: "2022-03-15",
  additionalInfo: "Prefers morning appointments. Has two dogs."
}, {
  id: 2,
  name: "Tech Startup Inc.",
  email: "office@techstartup.com",
  phone: "(555) 987-6543",
  phone2: "",
  address: "456 Business Park Drive",
  addresses: [{
    name: "Office",
    address: "456 Business Park Drive",
    notes: "Use service entrance on the back."
  }],
  status: "Active",
  lastService: "2024-01-08",
  totalJobs: 12,
  revenue: "$3,600",
  rating: 4,
  frequency: "Every 2 Weeks",
  preferredDay: "Wednesday",
  paymentMethod: "Check",
  customerSince: "2023-01-10",
  additionalInfo: "Contact reception upon arrival."
}, {
  id: 3,
  name: "Miller Family",
  email: "miller.family@email.com",
  phone: "(555) 456-7890",
  phone2: "(555) 567-8901",
  address: "789 Maple Avenue, Downtown",
  addresses: [{
    name: "Home",
    address: "789 Maple Avenue, Downtown",
    notes: ""
  }],
  status: "Inactive",
  lastService: "2023-12-15",
  totalJobs: 8,
  revenue: "$800",
  rating: 5,
  frequency: "Monthly",
  preferredDay: "Friday",
  paymentMethod: "Venmo",
  customerSince: "2021-06-20",
  additionalInfo: ""
}];
import { toast } from "sonner";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<typeof customers[0] | null>(null);

  const handleViewDetails = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (customer: typeof customers[0]) => {
    setCustomerToEdit(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = (customer: typeof customers[0]) => {
    toast.success(`Customer "${customer.name}" deleted successfully`);
  };
  return <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground">
                Manage your customer relationships and profiles
              </p>
            </div>
            <Button variant="hero" size="lg" className="flex items-center space-x-2" onClick={() => setIsCustomerModalOpen(true)}>
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </Button>
          </div>

          {/* Customer Modal - Create */}
          <CustomerModal open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen} mode="create" />

          {/* Customer Modal - Edit */}
          <CustomerModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} mode="edit" customer={customerToEdit} />

          {/* Customer Details Modal */}
          <CustomerDetailsModal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} customer={selectedCustomer} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">New Customers</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-success">+3 this week</p>
                  </div>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <UserPlus className="w-5 h-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Active Customers</p>
                    <p className="text-2xl font-bold text-foreground">132</p>
                    <p className="text-xs text-success">89.8% of total</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Inactive Customers</p>
                    <p className="text-2xl font-bold text-foreground">15</p>
                    <p className="text-xs text-muted-foreground">10.2% of total</p>
                  </div>
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <UserX className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold text-foreground">147</p>
                    <p className="text-xs text-muted-foreground">registered</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <Users className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Recurring Customers</p>
                    <p className="text-2xl font-bold text-foreground">89</p>
                    <p className="text-xs text-success">60.5% of total</p>
                  </div>
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Repeat className="w-5 h-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={searchField === "all" ? "Search by name, phone, email or address..." : searchField === "name" ? "Search by name..." : searchField === "phone" ? "Search by phone..." : searchField === "email" ? "Search by email..." : "Search by address..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-background border-border" />
            </div>
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Directory */}
          <Card>
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
              
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (/* Customer Table */
            <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Service</TableHead>
                      <TableHead>Total Jobs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.filter(customer => {
                  // Status filter
                  if (statusFilter === "active" && customer.status !== "Active") return false;
                  if (statusFilter === "inactive" && customer.status !== "Inactive") return false;
                  
                  // Search filter
                  const search = searchTerm.toLowerCase();
                  if (!searchTerm) return true;
                  if (searchField === "all") {
                    return customer.name.toLowerCase().includes(search) || customer.phone.toLowerCase().includes(search) || customer.email.toLowerCase().includes(search) || customer.address.toLowerCase().includes(search);
                  }
                  if (searchField === "name") return customer.name.toLowerCase().includes(search);
                  if (searchField === "phone") return customer.phone.toLowerCase().includes(search);
                  if (searchField === "email") return customer.email.toLowerCase().includes(search);
                  if (searchField === "address") return customer.address.toLowerCase().includes(search);
                  return true;
                }).map(customer => <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{customer.address}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{customer.paymentMethod}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.lastService}</TableCell>
                        <TableCell>{customer.totalJobs}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewDetails(customer)}>
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleEdit(customer)}>
                                <Pencil className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive" onClick={() => handleDelete(customer)}>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>) : (/* Customer Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customers.filter(customer => {
                // Status filter
                if (statusFilter === "active" && customer.status !== "Active") return false;
                if (statusFilter === "inactive" && customer.status !== "Inactive") return false;
                
                // Search filter
                const search = searchTerm.toLowerCase();
                if (!searchTerm) return true;
                if (searchField === "all") {
                  return customer.name.toLowerCase().includes(search) || customer.phone.toLowerCase().includes(search) || customer.email.toLowerCase().includes(search) || customer.address.toLowerCase().includes(search);
                }
                if (searchField === "name") return customer.name.toLowerCase().includes(search);
                if (searchField === "phone") return customer.phone.toLowerCase().includes(search);
                if (searchField === "email") return customer.email.toLowerCase().includes(search);
                if (searchField === "address") return customer.address.toLowerCase().includes(search);
                return true;
              }).map(customer => <Card key={customer.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{customer.name}</h3>
                              <div className="text-xs text-muted-foreground">
                                {"★".repeat(customer.rating)}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewDetails(customer)}>
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleEdit(customer)}>
                                <Pencil className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive" onClick={() => handleDelete(customer)}>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{customer.address}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {customer.totalJobs} jobs
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>)}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>;
}