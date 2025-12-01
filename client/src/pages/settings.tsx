import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <AppLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="parameters">
          <TabsList className="mb-6">
            <TabsTrigger value="parameters">FDC Parameters</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Parameters Tab */}
          <TabsContent value="parameters">
            <Card>
              <CardHeader>
                <CardTitle>Fault Detection Parameters</CardTitle>
                <CardDescription>
                  Configure global thresholds and sensitivity settings for the FDC engine.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Global Anomaly Threshold (Sigma)</Label>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[3]} max={6} step={0.1} className="flex-1" />
                      <span className="w-12 font-mono text-sm border rounded px-2 py-1 text-center">3.0</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Signal Smoothing (Moving Average Window)</Label>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[10]} max={100} step={1} className="flex-1" />
                      <span className="w-12 font-mono text-sm border rounded px-2 py-1 text-center">10ms</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Retrain Models</Label>
                      <p className="text-sm text-muted-foreground">Automatically update models with verified fault data</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage access and permissions for the FDC module.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { name: "Alice Engineer", role: "Admin", email: "alice@sensorqubit.com", initials: "AE" },
                    { name: "Bob Operator", role: "Editor", email: "bob@sensorqubit.com", initials: "BO" },
                    { name: "Charlie Viewer", role: "Viewer", email: "charlie@sensorqubit.com", initials: "CV" },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{member.role}</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">Invite New Member</Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AppLayout>
  );
}
