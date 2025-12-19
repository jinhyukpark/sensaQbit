import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, CreditCard, Shield, Users, Database, Key, Plus, Check, Server, 
  Factory, Cog, Wrench, Activity, ChevronRight, FolderTree, Trash2, Edit2, Info
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

// Mock Data for Hierarchy
const initialHierarchy = [
  {
    id: "fac-1", type: "factory", name: "Factory Alpha",
    fields: { location: "Austin, TX", manager: "Sarah Connor" },
    children: [
      {
        id: "proc-1-1", type: "process", name: "Etching Line A",
        fields: { capacity: "2000 uph", protocol: "v2.1" },
        children: [
          {
            id: "eq-1-1", type: "equipment", name: "Robot Arm K-200",
            fields: { manufacturer: "Fanuc", model: "R-2000iC" },
            children: [
              { id: "sens-1", type: "sensor", name: "Vibration Sensor X", category: "vibration", fields: { range: "0-100Hz" } }
            ]
          }
        ]
      }
    ]
  }
];

// Mock Models Data
const availableModels = [
  {
    id: "m-01",
    name: "Vibration_Anomaly_V2",
    version: "2.1.0",
    precision: "98.2%",
    description: "Detects mechanical wear and tear by analyzing frequency spectrums from accelerometer data. Ideal for rotating machinery like motors and gearboxes.",
    features: ["Frequency Analysis", "Auto-Calibration", "Low Latency"],
    status: "active"
  },
  {
    id: "m-02",
    name: "Temp_Spike_Detector",
    version: "1.0.4",
    precision: "94.1%",
    description: "Real-time monitoring of thermal sensors to identify rapid temperature escalations that indicate overheating or cooling failure.",
    features: ["Thermal Thresholding", "Gradient Analysis"],
    status: "available"
  },
  {
    id: "m-03",
    name: "Pressure_Drop_LSTM",
    version: "3.2.1",
    precision: "99.0%",
    description: "Predicts sudden pressure drops in pneumatic lines using sequential data analysis, preventing vacuum seal failures in pick-and-place robots.",
    features: ["Time-Series Prediction", "Context Awareness"],
    status: "available"
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("system");
  const [selectedNode, setSelectedNode] = useState<any>(initialHierarchy[0]);
  const [configTab, setConfigTab] = useState("master-data");
  const [selectedModel, setSelectedModel] = useState<string>("m-01");

  // Dynamic Fields State (Mocked)
  const [dynamicFields, setDynamicFields] = useState<{key: string, value: string}[]>([
    { key: "location", value: "Austin, TX" },
    { key: "manager", value: "Sarah Connor" }
  ]);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const addField = () => {
    if (newFieldKey && newFieldValue) {
      setDynamicFields([...dynamicFields, { key: newFieldKey, value: newFieldValue }]);
      setNewFieldKey("");
      setNewFieldValue("");
    }
  };

  const removeField = (index: number) => {
    setDynamicFields(dynamicFields.filter((_, i) => i !== index));
  };

  // Helper to render tree nodes recursively
  const renderTree = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors ${selectedNode?.id === node.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground"}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            setSelectedNode(node);
            // Reset fields for demo based on node
            setDynamicFields(Object.entries(node.fields || {}).map(([k, v]) => ({ key: k, value: v as string })));
          }}
        >
          {node.type === "factory" && <Factory className="w-3.5 h-3.5" />}
          {node.type === "process" && <Cog className="w-3.5 h-3.5" />}
          {node.type === "equipment" && <Wrench className="w-3.5 h-3.5" />}
          {node.type === "sensor" && <Activity className="w-3.5 h-3.5" />}
          <span className="truncate">{node.name}</span>
        </div>
        {node.children && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <AppLayout title="Settings" hideFilters={true}>
      <div className="max-w-6xl mx-auto pb-10 h-[calc(100vh-140px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 shrink-0">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Account & License
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" /> System & FDC Configuration
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Team & Security
            </TabsTrigger>
          </TabsList>
          
          {/* Account & License Tab (Unchanged content from previous, condensed for brevity) */}
          <TabsContent value="account" className="space-y-6 overflow-y-auto">
            {/* ... Existing Account Content ... */}
             <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Account Information</CardTitle>
                  <CardDescription>Manage your personal profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Jane Doe</h3>
                      <p className="text-sm text-muted-foreground">Senior FDC Engineer</p>
                    </div>
                  </div>
                  <div className="grid gap-2"><Label>Email Address</Label><Input defaultValue="jane.doe@sensorqubit.com" /></div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4"><Button>Save Changes</Button></CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Current License</CardTitle>
                  <CardDescription>View and update your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-start mb-2">
                      <div><h4 className="font-semibold text-primary">Enterprise Pro</h4><p className="text-xs text-muted-foreground">Unlimited sensors</p></div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" /> Security Settings
                  </CardTitle>
                  <CardDescription>Update your password and authentication methods.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button variant="secondary">Change Password</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* System & FDC Configuration Tab (Revamped) */}
          <TabsContent value="system" className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex gap-6 min-h-0">
              {/* Sidebar for Sub-navigation */}
              <div className="w-64 shrink-0 space-y-2">
                <Button 
                  variant={configTab === "master-data" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setConfigTab("master-data")}
                >
                  <FolderTree className="w-4 h-4 mr-2" /> Master Data Hierarchy
                </Button>
                <Button 
                  variant={configTab === "models" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setConfigTab("models")}
                >
                  <Database className="w-4 h-4 mr-2" /> Model Management
                </Button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-background border rounded-lg overflow-hidden shadow-sm flex flex-col">
                {configTab === "master-data" && (
                  <div className="flex h-full">
                    {/* Left: Tree View */}
                    <div className="w-1/3 border-r flex flex-col bg-muted/10">
                      <div className="p-4 border-b flex justify-between items-center bg-background">
                        <h3 className="font-medium text-sm">System Hierarchy</h3>
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
                      </div>
                      <ScrollArea className="flex-1 p-2">
                        <div className="space-y-1">
                          {renderTree(initialHierarchy)}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Right: Details & Config */}
                    <div className="flex-1 flex flex-col overflow-y-auto bg-background">
                      {selectedNode ? (
                        <div className="p-6 space-y-8">
                          {/* Header Info */}
                          <div className="flex justify-between items-start">
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{selectedNode.type}</Badge>
                                 <span className="text-xs text-muted-foreground font-mono">ID: {selectedNode.id}</span>
                               </div>
                               <h2 className="text-2xl font-bold">{selectedNode.name}</h2>
                             </div>
                             <div className="flex gap-2">
                               <Button size="sm" variant="outline"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                               <Button size="sm"><Check className="w-4 h-4 mr-2" /> Save</Button>
                             </div>
                          </div>

                          <Separator />

                          {/* Base Configuration */}
                          <div className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2 text-primary">
                              <Cog className="w-4 h-4" /> Base Configuration
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Name / Identifier</Label>
                                <Input defaultValue={selectedNode.name} />
                              </div>
                              <div className="space-y-2">
                                <Label>System Code</Label>
                                <Input defaultValue={selectedNode.id.toUpperCase()} disabled />
                              </div>
                              {selectedNode.type === "sensor" && (
                                <div className="space-y-2 col-span-2">
                                  <Label>Sensor Category</Label>
                                  <Select defaultValue={selectedNode.category || "vibration"}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="vibration">Vibration</SelectItem>
                                      <SelectItem value="temperature">Temperature</SelectItem>
                                      <SelectItem value="pressure">Pressure</SelectItem>
                                      <SelectItem value="flow">Flow Rate</SelectItem>
                                      <SelectItem value="power">Power / Electrical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Dynamic Fields */}
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                               <h3 className="font-medium flex items-center gap-2 text-primary">
                                 <Edit2 className="w-4 h-4" /> Extended Properties
                               </h3>
                               <Badge variant="secondary" className="font-normal text-xs">{dynamicFields.length} fields defined</Badge>
                             </div>
                             
                             <div className="bg-muted/30 border rounded-lg p-4 space-y-4">
                               {dynamicFields.map((field, idx) => (
                                 <div key={idx} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                                   <div className="flex-1 space-y-1">
                                     <Label className="text-xs text-muted-foreground">Property Key</Label>
                                     <Input value={field.key} readOnly className="bg-background" />
                                   </div>
                                   <div className="flex-1 space-y-1">
                                     <Label className="text-xs text-muted-foreground">Value</Label>
                                     <Input defaultValue={field.value} className="bg-background" />
                                   </div>
                                   <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => removeField(idx)}>
                                     <Trash2 className="w-4 h-4" />
                                   </Button>
                                 </div>
                               ))}
                               
                               <div className="flex gap-4 items-end pt-2 border-t mt-2 border-dashed">
                                 <div className="flex-1">
                                   <Input 
                                     placeholder="New property name (e.g. MaxTemp)" 
                                     value={newFieldKey}
                                     onChange={(e) => setNewFieldKey(e.target.value)}
                                     className="bg-background border-dashed focus:border-solid"
                                   />
                                 </div>
                                 <div className="flex-1">
                                   <Input 
                                     placeholder="Value" 
                                     value={newFieldValue}
                                     onChange={(e) => setNewFieldValue(e.target.value)}
                                     className="bg-background border-dashed focus:border-solid"
                                   />
                                 </div>
                                 <Button size="sm" variant="secondary" onClick={addField} disabled={!newFieldKey || !newFieldValue}>
                                   <Plus className="w-4 h-4" /> Add
                                 </Button>
                               </div>
                             </div>
                             <p className="text-xs text-muted-foreground flex items-center gap-2">
                               <Info className="w-3 h-3" />
                               Add custom metadata fields specific to this {selectedNode.type}. These will be indexed for search.
                             </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                          Select an item from the hierarchy to configure
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {configTab === "models" && (
                  <div className="flex h-full p-6 gap-6">
                    {/* Model List */}
                    <div className="w-1/3 space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Available Models</h3>
                        <p className="text-xs text-muted-foreground">Select a model to configure its deployment settings.</p>
                      </div>
                      <div className="space-y-3">
                        {availableModels.map((model) => (
                          <div 
                            key={model.id} 
                            onClick={() => setSelectedModel(model.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedModel === model.id ? "bg-primary/5 border-primary ring-1 ring-primary/20" : "hover:bg-accent bg-card"}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-sm">{model.name}</h4>
                              {selectedModel === model.id && <Badge className="text-[10px] h-5">Selected</Badge>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span>v{model.version}</span>
                              <span>•</span>
                              <span>{model.precision} Acc</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {model.id === "m-01" && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Primary Active</Badge>}
                              <Badge variant="secondary" className="text-[10px]">{model.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full" variant="outline"><Plus className="w-4 h-4 mr-2" /> Upload New Model</Button>
                    </div>

                    {/* Model Details */}
                    <div className="flex-1 border rounded-lg bg-card overflow-hidden flex flex-col">
                      {availableModels.map(m => m.id === selectedModel && (
                        <div key={m.id} className="flex-1 flex flex-col">
                           <div className="p-6 border-b bg-muted/5">
                             <div className="flex justify-between items-start">
                               <div>
                                 <h2 className="text-xl font-bold flex items-center gap-2">
                                   <Database className="w-5 h-5 text-primary" />
                                   {m.name}
                                 </h2>
                                 <p className="text-sm text-muted-foreground mt-1">ID: {m.id} • Version {m.version}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Label className="text-xs font-medium mr-2">Set as Primary</Label>
                                 <Switch checked={m.id === "m-01"} />
                               </div>
                             </div>
                           </div>
                           
                           <ScrollArea className="flex-1">
                             <div className="p-6 space-y-6">
                               <div className="space-y-2">
                                 <Label>Model Description</Label>
                                 <Textarea 
                                   defaultValue={m.description} 
                                   className="min-h-[80px] text-sm resize-none"
                                 />
                                 <p className="text-xs text-muted-foreground">Describe the model's purpose and optimal use cases.</p>
                               </div>

                               <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                   <Label>Key Features</Label>
                                   <div className="bg-muted/20 border rounded-md p-3 space-y-2">
                                     {m.features.map((f, i) => (
                                       <div key={i} className="flex items-center gap-2 text-sm bg-background p-2 rounded border shadow-sm">
                                         <Check className="w-3 h-3 text-primary" />
                                         {f}
                                       </div>
                                     ))}
                                     <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-primary">
                                       <Plus className="w-3 h-3 mr-2" /> Add Feature
                                     </Button>
                                   </div>
                                 </div>

                                 <div className="space-y-4">
                                   <div className="space-y-2">
                                      <Label>Performance Metrics</Label>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 border rounded bg-background text-center">
                                          <div className="text-xl font-bold text-primary">{m.precision}</div>
                                          <div className="text-[10px] text-muted-foreground uppercase">Precision</div>
                                        </div>
                                        <div className="p-2 border rounded bg-background text-center">
                                          <div className="text-xl font-bold text-primary">0.97</div>
                                          <div className="text-[10px] text-muted-foreground uppercase">F1 Score</div>
                                        </div>
                                      </div>
                                   </div>
                                   
                                   <div className="space-y-2">
                                      <Label>Input Requirements</Label>
                                      <Select defaultValue="ts">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ts">Time-Series (CSV/JSON)</SelectItem>
                                          <SelectItem value="img">Image / Thermography</SelectItem>
                                          <SelectItem value="ac">Acoustic Stream</SelectItem>
                                        </SelectContent>
                                      </Select>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </ScrollArea>
                           
                           <div className="p-4 border-t bg-muted/5 flex justify-end gap-2">
                             <Button variant="outline">Discard Changes</Button>
                             <Button>Save Configuration</Button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Team & Security Tab (Unchanged content from previous, condensed for brevity) */}
          <TabsContent value="team" className="space-y-6 overflow-y-auto">
             <div className="grid gap-6 md:grid-cols-3">
               <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1"><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Team Members</CardTitle><CardDescription>Manage user access and roles.</CardDescription></div>
                  <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[{ name: "Jane Doe", role: "Admin", email: "jane@sensorqubit.com", initials: "JD", status: "Active" }].map((member) => (
                      <div key={member.email} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3"><Avatar><AvatarFallback>{member.initials}</AvatarFallback></Avatar><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-muted-foreground">{member.email}</p></div></div>
                        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Team Security</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>2FA Enforcement</Label></div><Switch defaultChecked /></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
