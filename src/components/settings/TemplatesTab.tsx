import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Eye } from "lucide-react";
import { TemplateEditorModal } from "./TemplateEditorModal";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "estimate" | "contract" | "invoice" | "receipt";
}

export function TemplatesTab() {
  const [templates] = useState<Template[]>([
    { id: "1", name: "Lead / Estimate Template", description: "Used for sending estimates and converted leads", type: "estimate" },
    { id: "2", name: "Terms & Conditions", description: "Used for terms, conditions and digital signatures", type: "contract" },
    { id: "3", name: "Invoice Template", description: "Used for billing and charging", type: "invoice" },
    { id: "4", name: "Receipt Template", description: "Used for payment confirmation", type: "receipt" },
  ]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditorOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditorOpen(true);
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
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template)}>
                    <Eye className="w-4 h-4 mr-2" />
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

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <TemplateEditorModal
          open={editorOpen}
          onOpenChange={setEditorOpen}
          templateType={selectedTemplate.type}
          templateName={selectedTemplate.name}
        />
      )}
    </div>
  );
}
