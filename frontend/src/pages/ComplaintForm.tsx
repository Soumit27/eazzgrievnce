import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComplaint, CreateComplaintPayload } from "@/service/complaint";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Upload, MapPin, Camera, FileText, AlertCircle, Phone, Mail } from "lucide-react";

// Categories
const categories = [
  "Complaint Faulty Meter",
  "Complaint Unauthorised Meter",
  "Complaint For Water Pressure",
  "Complaint for Quality of the Waters",
  "Other" // ✅ Keep as "Other"
];

const kycOptions = [
  "PAN Card",
  "Driving License",
  "Voter ID",
  "Passport",
  "Other"
];


const ComplaintForm = () => {
  const queryClient = useQueryClient();

  // "Other" category state
  const [otherCategory, setOtherCategory] = useState("");
  const [selectedKYC, setSelectedKYC] = useState("");
  const [otherKYC, setOtherKYC] = useState("");
  const [kycFiles, setKycFiles] = useState<File[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    complaint_category: "",
    complaint_subject: "",
    detailed_description: "",
    complete_address: "",
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);



  const handleKycFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setKycFiles(Array.from(e.target.files));
  };

  // React Query mutation
  const mutation = useMutation({
    mutationFn: (payload: CreateComplaintPayload) => createComplaint(payload),
    onSuccess: (newComplaint) => {
      alert("Complaint submitted successfully!");
      queryClient.setQueryData(["complaints"], (oldData: any) => [...(oldData || []), newComplaint]);
      setFormData({
        full_name: "",
        mobile_number: "",
        email: "",
        complaint_category: "",
        complaint_subject: "",
        detailed_description: "",
        complete_address: "",
      });
      setSelectedFiles([]);
      setLocation(null);
      setOtherCategory("");
    },
    onError: () => alert("Failed to submit complaint."),
  });

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // File selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  // Capture location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.error("Error getting location:", err)
      );
    }
  };

  // Submit form
  const handleSubmit = () => {
    if (!location) return alert("Please capture your location!");

    // Use "otherCategory" if "Other" is selected
    const finalCategory = formData.complaint_category === "other" ? otherCategory : formData.complaint_category;

    mutation.mutate({
      ...formData,
      complaint_category: finalCategory,
      location,
      evidence_files: selectedFiles.map(file => ({
        file_name: file.name,
        file_type: file.type,
        file_url: URL.createObjectURL(file), // Replace with uploaded URL in production
      })),
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">New Complaint</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" placeholder="Enter your full name" value={formData.full_name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_number">Mobile Number *</Label>
                    <Input id="mobile_number" type="tel" placeholder="Enter mobile number" value={formData.mobile_number} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} />
                </div>


                <div className="flex items-center gap-3">
                  {/* KYC Dropdown */}
                  <Select
                    value={selectedKYC}
                    onValueChange={(val) => setSelectedKYC(val)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select KYC type" />
                    </SelectTrigger>
                    <SelectContent>
                      {kycOptions.map((kyc) => (
                        <SelectItem
                          key={kyc}
                          value={kyc.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {kyc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="kyc-file-upload"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleKycFileSelect}
                  />

                  {/* Button triggers the file input programmatically */}
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => document.getElementById("kyc-file-upload")?.click()}
                    className="px-3 py-2 rounded-lg text-sm"
                  >
                    Choose File
                  </Button>
                </div>






                {/* Complaint Details */}
                <div className="space-y-2">
                  <Label htmlFor="category">Complaint Category *</Label>
                  <Select
                    value={formData.complaint_category}
                    onValueChange={val => setFormData(prev => ({ ...prev, complaint_category: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.complaint_category === "other" && (
                    <Input
                      placeholder="Specify other category"
                      value={otherCategory}
                      onChange={e => setOtherCategory(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complaint_subject">Complaint Subject *</Label>
                  <Input id="complaint_subject" placeholder="Brief description of the issue" value={formData.complaint_subject} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed_description">Detailed Description *</Label>
                  <Textarea id="detailed_description" placeholder="Provide a detailed description of your complaint..." value={formData.detailed_description} onChange={handleChange} className="min-h-32" />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location Information</Label>
                    <Button type="button" variant="outline" onClick={getLocation} className="text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Current Location
                    </Button>
                  </div>
                  {location && (
                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-success font-medium">Location captured successfully!</p>
                      <p className="text-sm text-muted-foreground">
                        Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="complete_address">Complete Address *</Label>
                    <Textarea id="complete_address" placeholder="Enter complete address with landmarks" className="min-h-20" value={formData.complete_address} onChange={handleChange} />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Evidence (Photos/Videos)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">Upload Photos or Videos</p>
                      <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                      <Button type="button" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected files:</p>
                      {selectedFiles.map((file, index) => (
                        <Badge key={index} variant="secondary" className="mr-2">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button className="w-full" size="lg" onClick={handleSubmit} disabled={mutation.isPending}>
                    <FileText className="w-4 h-4 mr-2" />
                    {mutation.isPending ? "Submitting..." : "Submit Complaint"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scan to Open</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-3">
                <QRCodeCanvas value={window.location.href} size={180} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={true} />
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code to open Complaint Form on your mobile
                </p>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-primary" />
                  <p>Provide accurate and complete information for faster resolution</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Camera className="w-4 h-4 mt-0.5 text-primary" />
                  <p>Upload clear photos/videos as evidence to support your complaint</p>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                  <p>Enable location access for accurate geo-tagging</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 mt-0.5 text-primary" />
                  <p>You'll receive SMS updates on your complaint status</p>
                </div>
              </CardContent>
            </Card>

            {/* Expected Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expected Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Validation</span><Badge variant="secondary">2-4 hours</Badge></div>
                <div className="flex justify-between"><span>Assignment</span><Badge variant="secondary">4-8 hours</Badge></div>
                <div className="flex justify-between"><span>Resolution</span><Badge variant="secondary">Depend On Priority</Badge></div>
                <div className="flex justify-between"><span>Closure</span><Badge variant="secondary">Depend On Work</Badge></div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@eazzgrievance.gov.in</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
