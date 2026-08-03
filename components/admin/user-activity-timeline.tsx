import React from 'react';
import { Clock, Shield, UserCheck, Key, FileEdit } from 'lucide-react';
import dayjs from 'dayjs';

interface UserActivityTimelineProps {
  auditLogs?: Array<{
    id: string;
    module: string;
    action: string;
    createdAt: string;
  }>;
  lastLoginAt?: string | null;
}

export const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({
  auditLogs = [],
  lastLoginAt,
}) => {
  return (
    <div className="space-y-4 text-xs">
      {/* Last Login Banner */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900 dark:text-white">Last Active Session:</span>
        </div>
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {lastLoginAt ? dayjs(lastLoginAt).format('MMM D, YYYY • h:mm A') : 'No recent login recorded'}
        </span>
      </div>

      <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider pt-2">
        Recent Audit Activity Logs
      </h4>

      {auditLogs && auditLogs.length > 0 ? (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                <FileEdit className="w-3.5 h-3.5 text-indigo-500" />
              </div>

              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px]">
                    {log.module} — {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dayjs(log.createdAt).format('MMM D, YYYY • h:mm A')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No audit logs recorded for this staff user account yet.
        </div>
      )}
    </div>
  );
};
