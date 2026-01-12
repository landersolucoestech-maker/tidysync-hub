import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Edit } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "estimate" | "contract" | "invoice" | "receipt";
}

export function TemplatesTab() {
  const [templates] = useState<Template[]>([
    { id: "1", name: "Lead / Estimate Template", description: "Used for sending estimates and converted leads", type: "estimate" },
    { id: "2", name: "Contract Template", description: "Used for contract sending and digital signatures", type: "contract" },
    { id: "3", name: "Invoice Template", description: "Used for billing and charging", type: "invoice" },
    { id: "4", name: "Receipt Template", description: "Used for payment confirmation", type: "receipt" },
  ]);

  const handleEditTemplate = (id: string) => {
    toast.info("Template editor would open here");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Templates
          </CardTitle>
          <CardDescription>
            All templates must include in the header: Company Logo, Company Data, and Customer Data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.info("Preview would open here")}>
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Header Requirements (All Templates)</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Company Logo</li>
                <li>Company Information</li>
                <li>Customer Information</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Template Uses</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Estimate:</strong> Sending quotes, converted leads</li>
                <li><strong>Contract:</strong> Contract sending, digital signatures</li>
                <li><strong>Invoice:</strong> Billing, charging</li>
                <li><strong>Receipt:</strong> Payment confirmation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
