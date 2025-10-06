import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Star,
  MapPin
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalComplaints: number;
    pendingValidation: number;
    inProgress: number;
    completedToday: number;
    slaBreaches: number;
    completionRate: number;
    avgRating: number;
    activeWorkers: number;
  }
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Complaints",
      value: stats.totalComplaints.toLocaleString(),
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Pending Validation", 
      value: stats.pendingValidation,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "SLA Breaches",
      value: stats.slaBreaches,  
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Avg Rating",
      value: `${stats.avgRating}/5`,
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Active Workers",
      value: stats.activeWorkers,
      icon: MapPin,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className={`p-2 rounded-lg w-fit mb-3 ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.title}</div>
          </CardContent>
        </Card>
      ))}  
    </div>
  );
};