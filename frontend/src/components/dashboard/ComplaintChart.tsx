import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ComplaintChartProps {
  type: "status" | "category" | "trend" | "sla";
}

export const ComplaintChart = ({ type }: ComplaintChartProps) => {
  const statusData = [
    { name: "Pending", value: 23, color: "#f59e0b" },
    { name: "In Progress", value: 89, color: "#3b82f6" },
    { name: "Completed", value: 156, color: "#10b981" },
    { name: "Rejected", value: 12, color: "#ef4444" }
  ];

  const categoryData = [
    { category: "Street Lighting", complaints: 45, resolved: 38 },
    { category: "Water Supply", complaints: 32, resolved: 28 },
    { category: "Road Maintenance", complaints: 28, resolved: 25 },
    { category: "Garbage Collection", complaints: 24, resolved: 22 },
    { category: "Drainage", complaints: 18, resolved: 15 },
    { category: "Others", complaints: 12, resolved: 10 }
  ];

  const trendData = [
    { month: "Jan", submitted: 120, resolved: 115 },
    { month: "Feb", submitted: 135, resolved: 128 },
    { month: "Mar", submitted: 148, resolved: 142 },
    { month: "Apr", submitted: 162, resolved: 155 },
    { month: "May", submitted: 175, resolved: 168 },
    { month: "Jun", submitted: 189, resolved: 182 }
  ];

  const slaData = [
    { timeframe: "Within SLA", count: 145, percentage: 87 },
    { timeframe: "SLA Breach", count: 22, percentage: 13 }
  ];

  const renderChart = () => {
    switch (type) {
      case "status":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Complaint Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "category":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="complaints" fill="hsl(var(--primary))" name="Total Complaints" />
                  <Bar dataKey="resolved" fill="hsl(var(--success))" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "trend":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Complaint Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submitted" stroke="hsl(var(--primary))" strokeWidth={2} name="Submitted" />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(var(--success))" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "sla":
        return (
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={slaData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="timeframe" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderChart();
};