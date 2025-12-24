import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [fileName, setFileName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('processing');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upload Medical Bill
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your medical bill for instant AI-powered analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div className="glass rounded-2xl p-8 border border-white/10 shadow-xl">
            <Label className="mb-4 block text-lg">Bill Document</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative overflow-hidden ${
                isDragging
                  ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10 scale-[1.02]"
                  : fileName
                  ? "border-green-500 bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
              )}
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer relative z-10">
                <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all ${
                  fileName 
                    ? "gradient-success glow-primary scale-110" 
                    : "gradient-primary"
                }`}>
                  {fileName ? (
                    <CheckCircle2 className="h-10 w-10 text-white animate-pulse" />
                  ) : (
                    <Upload className="h-10 w-10 text-white" />
                  )}
                </div>
                {fileName ? (
                  <div>
                    <p className="text-foreground mb-2 text-lg">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      ✓ File ready to upload • Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-foreground mb-2 text-lg">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>PDF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>JPG/PNG</span>
                      </div>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Supported formats */}
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                PDF
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs border border-secondary/20">
                JPG
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs border border-accent/20">
                PNG
              </span>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl">Additional Information (Optional)</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital or Provider Name</Label>
              <Input
                id="hospital"
                placeholder="e.g., City General Hospital"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="bg-input-background border-border/50 focus:border-primary transition-all h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Service Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-input-background border-border/50 h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency Services</SelectItem>
                  <SelectItem value="surgery">Surgical Procedures</SelectItem>
                  <SelectItem value="diagnostics">Diagnostic Tests</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="glass rounded-2xl p-6 border border-white/10 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="mb-2 text-amber-600 dark:text-amber-400">Important Notice</h4>
              <p className="text-sm text-muted-foreground">
                This tool provides analytical insights, not medical or legal conclusions. 
                The analysis is meant to help you understand billing patterns and should not 
                be considered as professional advice.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="flex-1 h-14 border-2 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!fileName}
              className="flex-1 h-14 gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Submit for Analysis
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
