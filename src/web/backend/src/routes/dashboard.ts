import { Router, Request, Response } from 'express';
import { eq, and, gte, lt, sql, desc } from 'drizzle-orm';
import { db } from '../db/index';
import { clients, email_sequences } from '../db/schema';

interface DashboardStats {
  total_clients: number;
  appointments_this_week: number;
  pending_follow_ups: number;
  no_shows_this_month: number;
}

interface TodayTask {
  id: string;
  type: 'appointment' | 'email' | 'follow_up';
  title: string;
  description: string;
  time: string | null;
  client_id: string;
  client_name: string;
  status: string;
}

const router = Router();

// GET /api/dashboard/stats - Return dashboard statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // Get total clients count
    const totalClientsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients);
    const total_clients = totalClientsResult[0]?.count || 0;

    // Get appointments this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const appointmentsThisWeekResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(
        and(
          gte(clients.appointment_date, startOfWeek),
          lt(clients.appointment_date, endOfWeek)
        )
      );
    const appointments_this_week = appointmentsThisWeekResult[0]?.count || 0;

    // Get pending follow-ups (scheduled emails that haven't been sent yet)
    const pendingFollowUpsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(email_sequences)
      .where(
        and(
          eq(email_sequences.status, 'scheduled'),
          gte(email_sequences.scheduled_send_at, now)
        )
      );
    const pending_follow_ups = pendingFollowUpsResult[0]?.count || 0;

    // Get no-shows this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const noShowsThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(
        and(
          eq(clients.status, 'no_show'),
          gte(clients.updated_at, startOfMonth),
          lt(clients.updated_at, endOfMonth)
        )
      );
    const no_shows_this_month = noShowsThisMonthResult[0]?.count || 0;

    const stats: DashboardStats = {
      total_clients,
      appointments_this_week,
      pending_follow_ups,
      no_shows_this_month,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// GET /api/dashboard/today - Get today's tasks
router.get('/today', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const tasks: TodayTask[] = [];

    // Get today's appointments
    const todaysAppointments = await db
      .select({
        id: clients.id,
        first_name: clients.first_name,
        last_name: clients.last_name,
        appointment_date: clients.appointment_date,
        status: clients.status,
      })
      .from(clients)
      .where(
        and(
          gte(clients.appointment_date, startOfDay),
          lt(clients.appointment_date, endOfDay)
        )
      )
      .orderBy(clients.appointment_date);

    for (const appt of todaysAppointments) {
      if (appt.appointment_date) {
        tasks.push({
          id: `appt-${appt.id}`,
          type: 'appointment',
          title: 'Client Appointment',
          description: `Appointment with ${appt.first_name} ${appt.last_name}`,
          time: appt.appointment_date.toISOString(),
          client_id: appt.id,
          client_name: `${appt.first_name} ${appt.last_name}`,
          status: appt.status,
        });
      }
    }

    // Get emails scheduled for today
    const todaysEmails = await db
      .select({
        id: email_sequences.id,
        template_type: email_sequences.template_type,
        scheduled_send_at: email_sequences.scheduled_send_at,
        client_id: clients.id,
        first_name: clients.first_name,
        last_name: clients.last_name,
      })
      .from(email_sequences)
      .innerJoin(clients, eq(email_sequences.client_id, clients.id))
      .where(
        and(
          eq(email_sequences.status, 'scheduled'),
          gte(email_sequences.scheduled_send_at, startOfDay),
          lt(email_sequences.scheduled_send_at, endOfDay)
        )
      )
      .orderBy(email_sequences.scheduled_send_at);

    for (const email of todaysEmails) {
      const templateNames: Record<string, string> = {
        welcome: 'Welcome Email',
        reminder: 'Appointment Reminder',
        no_show: 'No-Show Follow-up',
        re_engagement: 'Re-engagement Email',
      };

      tasks.push({
        id: `email-${email.id}`,
        type: 'email',
        title: templateNames[email.template_type] || 'Scheduled Email',
        description: `Send ${templateNames[email.template_type] || 'email'} to ${email.first_name} ${email.last_name}`,
        time: email.scheduled_send_at?.toISOString() || null,
        client_id: email.client_id,
        client_name: `${email.first_name} ${email.last_name}`,
        status: 'scheduled',
      });
    }

    // Get clients needing follow-up (no_show status updated recently)
    const recentNoShows = await db
      .select({
        id: clients.id,
        first_name: clients.first_name,
        last_name: clients.last_name,
        updated_at: clients.updated_at,
        status: clients.status,
      })
      .from(clients)
      .where(
        and(
          eq(clients.status, 'no_show'),
          gte(clients.updated_at, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
        )
      )
      .orderBy(desc(clients.updated_at))
      .limit(5);

    for (const client of recentNoShows) {
      // Check if they already have a re_engagement email scheduled
      const existingFollowUp = await db
        .select({ count: sql<number>`count(*)` })
        .from(email_sequences)
        .where(
          and(
            eq(email_sequences.client_id, client.id),
            eq(email_sequences.template_type, 're_engagement'),
            eq(email_sequences.status, 'scheduled')
          )
        );

      if (existingFollowUp[0]?.count === 0) {
        tasks.push({
          id: `followup-${client.id}`,
          type: 'follow_up',
          title: 'No-Show Follow-up Needed',
          description: `${client.first_name} ${client.last_name} missed their appointment`,
          time: null,
          client_id: client.id,
          client_name: `${client.first_name} ${client.last_name}`,
          status: client.status,
        });
      }
    }

    // Sort tasks by time (null times at end)
    tasks.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    res.json({
      date: now.toISOString().split('T')[0],
      total_tasks: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s tasks' });
  }
});

// GET /api/dashboard - Alias for /stats (backward compatibility)
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Get total clients count
    const totalClientsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients);
    const total_clients = totalClientsResult[0]?.count || 0;

    // Get appointments this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const appointmentsThisWeekResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(
        and(
          gte(clients.appointment_date, startOfWeek),
          lt(clients.appointment_date, endOfWeek)
        )
      );
    const appointments_this_week = appointmentsThisWeekResult[0]?.count || 0;

    // Get pending follow-ups (scheduled emails that haven't been sent yet)
    const pendingFollowUpsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(email_sequences)
      .where(
        and(
          eq(email_sequences.status, 'scheduled'),
          gte(email_sequences.scheduled_send_at, now)
        )
      );
    const pending_follow_ups = pendingFollowUpsResult[0]?.count || 0;

    // Get no-shows this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const noShowsThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(
        and(
          eq(clients.status, 'no_show'),
          gte(clients.updated_at, startOfMonth),
          lt(clients.updated_at, endOfMonth)
        )
      );
    const no_shows_this_month = noShowsThisMonthResult[0]?.count || 0;

    const stats: DashboardStats = {
      total_clients,
      appointments_this_week,
      pending_follow_ups,
      no_shows_this_month,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export { router as dashboardRoutes };
