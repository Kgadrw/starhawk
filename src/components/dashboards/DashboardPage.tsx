import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export const StatCard = ({ title, value, icon, change, changeType = "neutral" }: StatCardProps) => {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-white/70"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p className={`text-sm ${changeColor[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-gray-800/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardPageProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const DashboardPage = ({ title, children, actions }: DashboardPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

interface DataTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => ReactNode;
  emptyMessage?: string;
}

export const DataTable = ({ headers, data, renderRow, emptyMessage = "No data available" }: DataTableProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-white/60">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {headers.map((header, index) => (
                  <th key={index} className="text-left py-3 px-4 font-medium text-white/80">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => renderRow(item, index))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
      case "completed":
        return "bg-green-400/20 text-green-400";
      case "pending":
      case "in-progress":
        return "bg-yellow-400/20 text-yellow-400";
      case "rejected":
      case "cancelled":
        return "bg-red-400/20 text-red-400";
      case "flagged":
        return "bg-orange-400/20 text-orange-400";
      default:
        return "bg-gray-800/20 text-white";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};
