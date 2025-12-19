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
import { User, CreditCard, Shield, Users, Database, Key, Plus, Check, Server } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout title="Settings" hideFilters={true}>
      <div className="max-w-5xl mx-auto pb-10">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Account & License
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" /> System & Models
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Team & Security
            </TabsTrigger>
          </TabsList>
          
          {/* Account & License Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Account Information
                  </CardTitle>
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
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="jane.doe@sensorqubit.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Administrator" disabled />
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              {/* License Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Current License
                  </CardTitle>
                  <CardDescription>View and update your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-primary">Enterprise Pro</h4>
                        <p className="text-xs text-muted-foreground">Unlimited sensors & models</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="text-sm mt-4 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Cycle</span>
                        <span>Annual</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Renewal</span>
                        <span>Oct 24, 2024</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Check className="w-4 h-4 mr-2" /> Update License
                  </Button>
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

          {/* System & Models Tab */}
          <TabsContent value="system" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2">
              {/* Model Selection */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" /> Active Model Configuration
                  </CardTitle>
                  <CardDescription>Select the primary AI model used for real-time fault detection.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="m1" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="m1" id="m1" className="peer sr-only" />
                      <Label
                        htmlFor="m1"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="mb-2 font-bold text-lg">Vibration_V2</div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Optimized for rotating machinery anomalies. High sensitivity to frequency shifts.
                        </p>
                        <Badge variant="outline">Precision: 98.2%</Badge>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="m2" id="m2" className="peer sr-only" />
                      <Label
                        htmlFor="m2"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="mb-2 font-bold text-lg">Temp_Spike_Net</div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Neural network trained on thermal imaging data. Detects hotspots instantly.
                        </p>
                        <Badge variant="outline">Precision: 94.1%</Badge>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="m3" id="m3" className="peer sr-only" />
                      <Label
                        htmlFor="m3"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="mb-2 font-bold text-lg">Pressure_LSTM</div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Long Short-Term Memory network for time-series pressure data analysis.
                        </p>
                        <Badge variant="outline">Precision: 99.0%</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button>Update Active Model</Button>
                </CardFooter>
              </Card>

              {/* Master Data */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" /> Master Data Management
                  </CardTitle>
                  <CardDescription>Configure system reference data and equipment definitions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div>Category</div>
                      <div>Code</div>
                      <div>Description</div>
                      <div className="text-right">Last Updated</div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm items-center border-b last:border-0">
                      <div>Equipment Type</div>
                      <div className="font-mono text-xs">EQ-ROBOT-ARM</div>
                      <div className="text-muted-foreground">6-Axis Industrial Robot</div>
                      <div className="text-right text-muted-foreground">2 days ago</div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm items-center border-b last:border-0">
                      <div>Sensor Type</div>
                      <div className="font-mono text-xs">SN-VIB-ACCEL</div>
                      <div className="text-muted-foreground">Piezoelectric Accelerometer</div>
                      <div className="text-right text-muted-foreground">1 week ago</div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm items-center border-b last:border-0">
                      <div>Fault Class</div>
                      <div className="font-mono text-xs">FLT-MECH-WEAR</div>
                      <div className="text-muted-foreground">Mechanical Bearing Wear</div>
                      <div className="text-right text-muted-foreground">1 month ago</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Master Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team & Security Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Team Management */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" /> Team Members
                    </CardTitle>
                    <CardDescription>Manage user access and roles.</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Jane Doe", role: "Admin", email: "jane@sensorqubit.com", initials: "JD", status: "Active" },
                      { name: "Bob Operator", role: "Editor", email: "bob@sensorqubit.com", initials: "BO", status: "Active" },
                      { name: "Charlie Viewer", role: "Viewer", email: "charlie@sensorqubit.com", initials: "CV", status: "Pending" },
                    ].map((member) => (
                      <div key={member.email} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{member.name}</p>
                              {member.status === "Pending" && <Badge variant="secondary" className="text-[10px] h-4">Pending</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue={member.role.toLowerCase()}>
                            <SelectTrigger className="w-[100px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Team Security
                  </CardTitle>
                  <CardDescription>Global security policies.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>2FA Enforcement</Label>
                      <p className="text-xs text-muted-foreground">Require 2FA for all admins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SSO Login</Label>
                      <p className="text-xs text-muted-foreground">Enable SAML/SSO</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-xs text-muted-foreground">Auto-logout after 30m</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-xs text-muted-foreground">Track all user actions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
