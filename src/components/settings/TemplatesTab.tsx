import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Eye, Upload, Trash2, Download } from "lucide-react";
import { TemplateEditorModal } from "./TemplateEditorModal";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "estimate" | "contract" | "invoice" | "receipt";
  isFileUpload?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: Date;
}

export function TemplatesTab() {
  const [templates] = useState<Template[]>([
    { id: "1", name: "Lead / Estimate Template", description: "Used for sending estimates and converted leads", type: "estimate" },
    { id: "2", name: "Terms & Conditions", description: "Upload your pre-made terms and conditions document", type: "contract", isFileUpload: true },
    { id: "3", name: "Invoice Template", description: "Used for billing and charging", type: "invoice" },
    { id: "4", name: "Receipt Template", description: "Used for payment confirmation", type: "receipt" },
  ]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [uploadedTermsFile, setUploadedTermsFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditTemplate = (template: Template) => {
    if (template.isFileUpload) return;
    setSelectedTemplate(template);
    setEditorOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    if (template.isFileUpload) {
      if (uploadedTermsFile) {
        toast.info("Preview would open the uploaded document");
      } else {
        toast.warning("No document uploaded yet");
      }
      return;
    }
    setSelectedTemplate(template);
    setEditorOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      
      setUploadedTermsFile({
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      });
      toast.success(`"${file.name}" uploaded successfully`);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setUploadedTermsFile(null);
    toast.success("Document removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
                    {template.isFileUpload && uploadedTermsFile && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {uploadedTermsFile.name} ({formatFileSize(uploadedTermsFile.size)})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {template.isFileUpload ? (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadedTermsFile ? "Replace" : "Upload"}
                      </Button>
                      {uploadedTermsFile && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => toast.info("Download would start")}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Template
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </>
                  )}
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
                <li><strong>Terms & Conditions:</strong> Upload pre-made document</li>
                <li><strong>Invoice:</strong> Billing, charging</li>
                <li><strong>Receipt:</strong> Payment confirmation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Editor Modal */}
      {selectedTemplate && !selectedTemplate.isFileUpload && (
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
