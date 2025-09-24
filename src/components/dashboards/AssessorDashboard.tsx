import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseDashboard } from "./BaseDashboard";
import { DashboardPage, StatCard, DataTable, StatusBadge } from "./DashboardPage";
import { 
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  FileText,
  BarChart3,
  Users,
  Bell,
  Camera,
  Activity,
  Shield
} from "lucide-react";

export const AssessorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  const assessments = [
    { id: "A001", farm: "Green Valley Farm", farmer: "John Doe", crop: "Maize", status: "completed", date: "2024-03-15", risk: "Low" },
    { id: "A002", farm: "Sunrise Fields", farmer: "Jane Smith", crop: "Rice", status: "in-progress", date: "2024-03-12", risk: "Medium" },
    { id: "A003", farm: "Mountain View", farmer: "Bob Wilson", crop: "Beans", status: "pending", date: "2024-03-10", risk: "High" }
  ];

  const renderDashboard = () => (
    <DashboardPage title="Assessor Portal" actions={
      <Button className="bg-orange-600 hover:bg-orange-700">
        <MapPin className="h-4 w-4 mr-2" />
        New Assessment
      </Button>
    }>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Assessments" value="45" icon={<FileText className="h-6 w-6 text-orange-600" />} change="+8 this week" changeType="positive" />
        <StatCard title="Pending Reviews" value="12" icon={<Clock className="h-6 w-6 text-yellow-600" />} change="3 due today" />
        <StatCard title="High Risk Farms" value="5" icon={<AlertTriangle className="h-6 w-6 text-red-600" />} change="Require attention" />
        <StatCard title="Completion Rate" value="92%" icon={<CheckCircle className="h-6 w-6 text-green-600" />} change="Above target" changeType="positive" />
      </div>

      <DataTable 
        headers={["Assessment ID", "Farm", "Farmer", "Crop", "Status", "Risk Level", "Date", "Actions"]}
        data={assessments}
        renderRow={(assessment) => (
          <tr key={assessment.id} className="border-b">
            <td className="py-3 px-4">{assessment.id}</td>
            <td className="py-3 px-4">{assessment.farm}</td>
            <td className="py-3 px-4">{assessment.farmer}</td>
            <td className="py-3 px-4">{assessment.crop}</td>
            <td className="py-3 px-4"><StatusBadge status={assessment.status} /></td>
            <td className="py-3 px-4"><StatusBadge status={assessment.risk} /></td>
            <td className="py-3 px-4">{assessment.date}</td>
            <td className="py-3 px-4">
              <Button size="sm" variant="outline">View</Button>
            </td>
          </tr>
        )}
      />
    </DashboardPage>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "assessments":
        return (
          <DashboardPage title="Field Assessments" actions={
            <Button className="bg-orange-600 hover:bg-orange-700">
              <MapPin className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          }>
            <DataTable 
              headers={["Assessment ID", "Farm", "Farmer", "Crop", "Status", "Risk Level", "Date", "Actions"]}
              data={assessments}
              renderRow={(assessment) => (
                <tr key={assessment.id} className="border-b">
                  <td className="py-3 px-4">{assessment.id}</td>
                  <td className="py-3 px-4">{assessment.farm}</td>
                  <td className="py-3 px-4">{assessment.farmer}</td>
                  <td className="py-3 px-4">{assessment.crop}</td>
                  <td className="py-3 px-4"><StatusBadge status={assessment.status} /></td>
                  <td className="py-3 px-4"><StatusBadge status={assessment.risk} /></td>
                  <td className="py-3 px-4">{assessment.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Edit</Button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </DashboardPage>
        );
      case "tasks":
        return (
          <DashboardPage title="Assessment Tasks">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">3 assessments due today</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">2 high-risk farms need immediate attention</span>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      case "reports":
        return (
          <DashboardPage title="Assessment Reports">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Assessments</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">38</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-medium text-yellow-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-red-600">2</span>
                </div>
              </div>
            </div>
          </DashboardPage>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <BaseDashboard 
      role="assessor" 
      activePage={activePage} 
      onPageChange={setActivePage}
    >
      {renderPage()}
    </BaseDashboard>
  );
};