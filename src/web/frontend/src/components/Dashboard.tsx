import React from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  UserX, 
  Plus,
  Mail,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Phone,
  ChevronRight
} from 'lucide-react';
import { Client, DashboardStats, ScheduledEmail } from './types';

interface DashboardProps {
  stats?: DashboardStats;
  recentClients?: Client[];
  scheduledEmails?: ScheduledEmail[];
  onAddClient?: () => void;
  onViewClient?: (clientId: string) => void;
  onViewAllClients?: () => void;
  loading?: boolean;
}

const statusConfig = {
  intake: { label: 'Intake', bg: 'bg-blue-100', text: 'text-blue-700' },
  confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700' },
  reminded: { label: 'Reminded', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  no_show: { label: 'No Show', bg: 'bg-red-100', text: 'text-red-700' },
  rescheduled: { label: 'Rescheduled', bg: 'bg-purple-100', text: 'text-purple-700' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-700' }
};

type TaskType = 'appointment' | 'followup' | 'confirmation';
type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  client: Client;
  priority: TaskPriority;
}

// Mock today's tasks based on client status
const getTodaysTasks = (clients: Client[]): Task[] => {
  const tasks: Task[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Find clients with appointments today
  const todaysAppointments = clients.filter(c => c.appointment_date === today);
  todaysAppointments.forEach(client => {
    tasks.push({
      id: `appt-${client.id}`,
      type: 'appointment',
      title: `Appointment with ${client.first_name} ${client.last_name}`,
      description: 'Scheduled for today',
      client,
      priority: 'high'
    });
  });
  
  // Find no-shows needing follow-up
  const noShows = clients.filter(c => c.status === 'no_show');
  noShows.forEach(client => {
    tasks.push({
      id: `followup-${client.id}`,
      type: 'followup',
      title: `Follow up with ${client.first_name} ${client.last_name}`,
      description: 'Missed appointment - needs re-engagement',
      client,
      priority: 'medium'
    });
  });
  
  // Find intakes needing confirmation
  const intakes = clients.filter(c => c.status === 'intake');
  intakes.forEach(client => {
    tasks.push({
      id: `confirm-${client.id}`,
      type: 'confirmation',
      title: `Confirm appointment for ${client.first_name} ${client.last_name}`,
      description: 'New intake pending confirmation',
      client,
      priority: 'medium'
    });
  });
  
  return tasks;
};

const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const Dashboard: React.FC<DashboardProps> = ({
  stats = {
    total_clients: 0,
    appointments_this_week: 0,
    pending_follow_ups: 0,
    no_shows_this_month: 0
  },
  recentClients = [],
  scheduledEmails = [],
  onAddClient,
  onViewClient,
  onViewAllClients,
  loading = false
}) => {
  const todaysTasks = getTodaysTasks(recentClients);
  
  const statCards = [
    { 
      label: 'Total Clients', 
      value: stats.total_clients, 
      icon: Users, 
      color: '#E6511A',
      ariaLabel: `${stats.total_clients} total clients`
    },
    { 
      label: "This Week's Appointments", 
      value: stats.appointments_this_week, 
      icon: Calendar, 
      color: '#10b981',
      ariaLabel: `${stats.appointments_this_week} appointments this week`
    },
    { 
      label: 'Pending Follow-ups', 
      value: stats.pending_follow_ups, 
      icon: AlertCircle, 
      color: '#f59e0b',
      ariaLabel: `${stats.pending_follow_ups} pending follow-ups`
    },
    { 
      label: 'No-shows This Month', 
      value: stats.no_shows_this_month, 
      icon: UserX, 
      color: '#ef4444',
      ariaLabel: `${stats.no_shows_this_month} no-shows this month`
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of your client follow-up system
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#E6511A] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isEmpty = stats.total_clients === 0;

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your client follow-up system
          </p>
        </div>
        <button
          onClick={onAddClient}
          className="inline-flex items-center justify-center gap-2 bg-[#E6511A] text-white px-5 py-3 rounded-xl font-light hover:bg-[#d14815] transition-colors shadow-lg"
          aria-label="Add new client"
        >
          <Plus size={20} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Empty State - First Time User */}
      {isEmpty && (
        <div className="bg-gradient-to-br from-[#E6511A]/5 to-[#E6511A]/10 rounded-2xl p-8 sm:p-12 border border-[#E6511A]/20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#E6511A] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-light text-[#252422] mb-3">
              Welcome to Your Client Follow-Up System!
            </h2>
            <p className="text-[#252422]/70 mb-8 leading-relaxed">
              You're all set up and ready to go. Add your first client to start automating 
              follow-up emails. The system will automatically send welcome emails, 
              appointment reminders, and no-show follow-ups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onAddClient}
                className="inline-flex items-center justify-center gap-2 bg-[#E6511A] text-white px-8 py-4 rounded-xl font-light hover:bg-[#d14815] transition-colors shadow-lg"
              >
                <Plus size={20} />
                <span>Add Your First Client</span>
              </button>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <p className="font-medium text-sm text-[#252422]">Automatic Emails</p>
                <p className="text-xs text-gray-500 mt-1">4-email sequence sent automatically</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <p className="font-medium text-sm text-[#252422]">Smart Reminders</p>
                <p className="text-xs text-gray-500 mt-1">Day-before appointment reminders</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <p className="font-medium text-sm text-[#252422]">Client Tracking</p>
                <p className="text-xs text-gray-500 mt-1">Track status and follow-ups</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid - Only show if there are clients */}
      {!isEmpty && (
        <section aria-label="Dashboard statistics">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                role="region"
                aria-label={stat.ariaLabel}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-light truncate">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-light text-[#252422] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon size={20} style={{ color: stat.color }} className="sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Tasks - Only show if there are clients */}
      {!isEmpty && (
        <section 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          aria-label="Today's tasks"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E6511A]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-[#E6511A]" size={20} />
                </div>
                <div>
                  <h2 className="font-light text-xl text-[#252422]">Today's Tasks</h2>
                  <p className="text-sm text-gray-500">
                    {todaysTasks.length === 0 ? 'No tasks for today' : `${todaysTasks.length} task${todaysTasks.length === 1 ? '' : 's'} to complete`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {todaysTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-light">All caught up!</p>
                <p className="text-sm mt-1">No tasks requiring attention today</p>
              </div>
            ) : (
              todaysTasks.map((task) => {
                const taskIcons: Record<TaskType, typeof Calendar> = {
                  appointment: Calendar,
                  followup: Phone,
                  confirmation: Mail
                };
                const TaskIcon = taskIcons[task.type];
                const priorityColors: Record<TaskPriority, string> = {
                  high: 'bg-red-100 text-red-700',
                  medium: 'bg-yellow-100 text-yellow-700',
                  low: 'bg-green-100 text-green-700'
                };
                
                return (
                  <div 
                    key={task.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewClient?.(task.client.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onViewClient?.(task.client.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        task.type === 'appointment' ? 'bg-blue-100' :
                        task.type === 'followup' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <TaskIcon className={
                          task.type === 'appointment' ? 'text-blue-600' :
                          task.type === 'followup' ? 'text-red-600' : 'text-green-600'
                        } size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-[#252422]">{task.title}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        {task.client.appointment_date && (
                          <p className="text-xs text-gray-400 mt-1">
                            Appointment: {formatDate(task.client.appointment_date)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Main Content Grid - Only show if there are clients */}
      {!isEmpty && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <section 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            aria-label="Recent clients"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-light text-xl text-[#252422]">Recent Clients</h2>
                <button
                  onClick={onViewAllClients}
                  className="text-[#E6511A] hover:text-[#d14815] text-sm font-light flex items-center gap-1 transition-colors"
                  aria-label="View all clients"
                >
                  View All
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentClients.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-light">No recent clients</p>
                  <p className="text-sm mt-1">Add a client to get started</p>
                </div>
              ) : (
                recentClients.slice(0, 5).map((client) => {
                  const status = statusConfig[client.status];
                  return (
                    <div 
                      key={client.id} 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onViewClient?.(client.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onViewClient?.(client.id)}
                      aria-label={`${client.first_name} ${client.last_name}, status: ${status.label}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#E6511A]/10 rounded-full flex items-center justify-center">
                            <span className="text-[#E6511A] font-light text-lg">
                              {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#252422] truncate">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{client.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex-shrink-0`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Today's Scheduled Emails */}
          <section 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            aria-label="Today's scheduled emails"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-light text-xl text-[#252422]">Today's Scheduled Emails</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={16} />
                  <span>{scheduledEmails.length}</span>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {scheduledEmails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-light">No emails scheduled</p>
                  <p className="text-sm mt-1">Emails will appear here when scheduled</p>
                </div>
              ) : (
                scheduledEmails.map((email) => (
                  <div 
                    key={email.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="text-blue-500" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-[#252422] truncate">
                            {email.client_name}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(email.scheduled_time)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{email.client_email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {email.template_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
