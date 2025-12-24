import { useState } from "react";
import { Database, Plus, Pencil, Trash2, TrendingUp, Activity, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface ReferenceItem {
  id: string;
  name: string;
  costRange: string;
  lastUpdated: string;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("medicines");

  const mockMedicines: ReferenceItem[] = [
    { id: "1", name: "Paracetamol 500mg", costRange: "$5 - $15", lastUpdated: "Dec 10, 2024" },
    { id: "2", name: "Amoxicillin 500mg", costRange: "$10 - $25", lastUpdated: "Dec 08, 2024" },
    { id: "3", name: "Ibuprofen 400mg", costRange: "$8 - $18", lastUpdated: "Dec 05, 2024" }
  ];

  const mockProcedures: ReferenceItem[] = [
    { id: "1", name: "General Consultation", costRange: "$180 - $220", lastUpdated: "Dec 12, 2024" },
    { id: "2", name: "X-Ray Chest", costRange: "$150 - $250", lastUpdated: "Dec 11, 2024" },
    { id: "3", name: "Blood Test - CBC", costRange: "$40 - $60", lastUpdated: "Dec 09, 2024" }
  ];

  const mockServices: ReferenceItem[] = [
    { id: "1", name: "Emergency Room Visit", costRange: "$500 - $1500", lastUpdated: "Dec 13, 2024" },
    { id: "2", name: "Operating Room Fee", costRange: "$1000 - $3000", lastUpdated: "Dec 10, 2024" },
    { id: "3", name: "ICU Per Day", costRange: "$2000 - $5000", lastUpdated: "Dec 08, 2024" }
  ];

  const getDataForTab = (tab: string): ReferenceItem[] => {
    switch (tab) {
      case "medicines":
        return mockMedicines;
      case "procedures":
        return mockProcedures;
      case "services":
        return mockServices;
      default:
        return [];
    }
  };

  const handleAdd = () => {
    alert("Add new entry form would open here");
  };

  const handleEdit = (id: string) => {
    alert(`Edit entry ${id} - Edit form would open here`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      alert(`Delete entry ${id}`);
    }
  };

  const getTotalEntries = () => {
    return mockMedicines.length + mockProcedures.length + mockServices.length;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage reference data and system configuration
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Entries</p>
                <p className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {getTotalEntries()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Reference database</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Medicines</p>
                <p className="text-4xl bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  {mockMedicines.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Active records</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Procedures</p>
                <p className="text-4xl bg-gradient-to-r from-accent to-amber-600 bg-clip-text text-transparent">
                  {mockProcedures.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Active records</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Update</p>
                <p className="text-lg">Dec 13</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">2024</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-2xl text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Add New Entry</h3>
                <p className="text-sm text-muted-foreground">Create a new reference record</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => alert("Bulk import would be handled here")}
            className="group bg-card rounded-2xl p-6 border border-border hover:border-secondary/50 transition-all shadow-lg hover:shadow-2xl text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Bulk Import Data</h3>
                <p className="text-sm text-muted-foreground">Import multiple records at once</p>
              </div>
            </div>
          </button>
        </div>

        {/* Reference Data Management */}
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-2xl">Reference Data Management</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse and manage pricing reference data</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted h-12">
              <TabsTrigger value="medicines" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                Medicines
              </TabsTrigger>
              <TabsTrigger value="procedures" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                Procedures
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-lg mr-1">
                    {getDataForTab(activeTab).length}
                  </span>
                  entries in this category
                </p>
                <Button 
                  onClick={handleAdd}
                  className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm text-muted-foreground">Cost Range</th>
                      <th className="text-left p-4 text-sm text-muted-foreground">Last Updated</th>
                      <th className="text-left p-4 text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataForTab(activeTab).map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-t border-border hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? '' : 'bg-muted/10'
                        }`}
                      >
                        <td className="p-4">{item.name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm border border-primary/20">
                            {item.costRange}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item.id)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
