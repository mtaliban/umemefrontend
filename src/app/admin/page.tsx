'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare, GraduationCap, Inbox, Plus,
  FolderKanban, Newspaper, Briefcase, ArrowRight,
  TrendingUp, Clock, User,
} from 'lucide-react';
import { adminGetDashboard } from '@/lib/api';
import type { DashboardData } from '@/lib/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-TZ', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'New Service Requests',
      value: data?.counts.service_requests ?? 0,
      icon: MessageSquare,
      href: '/admin/inbox/service-requests?status=new',
      gradient: 'linear-gradient(135deg, #7C2D12, #9A3412)',
      border: '#9A3412',
      badge: 'Pending review',
    },
    {
      label: 'Training Applications',
      value: data?.counts.training_applications ?? 0,
      icon: GraduationCap,
      href: '/admin/inbox/training-applications?status=new',
      gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
      border: '#F59E0B',
      badge: 'Awaiting action',
    },
    {
      label: 'New Messages',
      value: data?.counts.contact_messages ?? 0,
      icon: Inbox,
      href: '/admin/inbox/messages?status=new',
      gradient: 'linear-gradient(135deg, #C2410C, #EA580C)',
      border: '#EA580C',
      badge: 'Unread',
    },
  ];

  const quickActions = [
    {
      label: 'Add Project',
      href: '/admin/projects',
      icon: FolderKanban,
      gradient: 'linear-gradient(135deg, #7C2D12, #9A3412)',
    },
    {
      label: 'Add Post',
      href: '/admin/posts',
      icon: Newspaper,
      gradient: 'linear-gradient(135deg, #C2410C, #EA580C)',
    },
    {
      label: 'Add Service',
      href: '/admin/services',
      icon: Briefcase,
      gradient: 'linear-gradient(135deg, #EA580C, #F97316)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, href, gradient, border, badge }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
          >
            {/* left color bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: border }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-4xl font-bold text-gray-900 font-heading mt-2 leading-none">{value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{badge}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
              View all <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-700 font-heading mb-4 uppercase tracking-widest">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href, icon: Icon, gradient }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: gradient }}
            >
              <Plus className="w-4 h-4" />
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Latest items */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Service Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}>
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 font-heading">Service Requests</h2>
            </div>
            <Link href="/admin/inbox/service-requests" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.latest_service_requests?.length ? (
              data.latest_service_requests.map((req) => (
                <Link
                  key={req._id}
                  href={`/admin/inbox/service-requests?id=${req._id}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{formatDate(req.created_at)}</p>
                      <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${
                        req.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <MessageSquare className="w-7 h-7 text-gray-200" />
                <p className="text-sm text-gray-400">No requests yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Training Applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                <GraduationCap className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 font-heading">Applications</h2>
            </div>
            <Link href="/admin/inbox/training-applications" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.latest_training_applications?.length ? (
              data.latest_training_applications.map((app) => (
                <div key={app._id} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(245,158,11,0.12)' }}>
                    <User className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{app.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{formatDate(app.created_at)}</p>
                      <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${
                        app.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <GraduationCap className="w-7 h-7 text-gray-200" />
                <p className="text-sm text-gray-400">No applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>
                <Inbox className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 font-heading">Messages</h2>
            </div>
            <Link href="/admin/inbox/messages" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.latest_messages?.length ? (
              data.latest_messages.map((msg) => (
                <div key={msg._id} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{msg.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{msg.subject || msg.message.slice(0, 40)}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Inbox className="w-7 h-7 text-gray-200" />
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
