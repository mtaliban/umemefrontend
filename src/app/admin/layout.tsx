'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Settings, Images, BarChart3, Shield, Workflow,
  FileText, Users, Award, Briefcase, FolderKanban, GraduationCap,
  Building, Star, Newspaper, Camera, HelpCircle, MapPin, Download,
  Inbox, MessageSquare, UserCog, Activity, LogOut, Menu, X, ChevronDown,
  Zap, Droplets, ExternalLink,
} from 'lucide-react';
import { adminMe, adminLogout } from '@/lib/api';
import type { User } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, roles: ['super_admin'] },
  {
    href: '#content',
    label: 'Content',
    icon: FileText,
    children: [
      { href: '/admin/hero-slides', label: 'Hero Slides', icon: Images },
      { href: '/admin/stats', label: 'Statistics', icon: BarChart3 },
      { href: '/admin/features', label: 'Why Choose Us', icon: Shield },
      { href: '/admin/work-steps', label: 'How We Work', icon: Workflow },
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/team', label: 'Team', icon: Users },
      { href: '/admin/certifications', label: 'Certifications', icon: Award },
      { href: '/admin/services', label: 'Services', icon: Briefcase },
      { href: '/admin/service-categories', label: 'Service Categories', icon: FolderKanban },
      { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/training', label: 'Training', icon: GraduationCap },
      { href: '/admin/training-intakes', label: 'Training Intakes', icon: GraduationCap },
      { href: '/admin/training-steps', label: 'Training Steps', icon: Workflow },
      { href: '/admin/clients', label: 'Clients', icon: Building },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/posts', label: 'News & Posts', icon: Newspaper },
      { href: '/admin/gallery', label: 'Gallery', icon: Camera },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/admin/offices', label: 'Offices', icon: MapPin },
      { href: '/admin/downloads', label: 'Downloads', icon: Download },
    ],
  },
  {
    href: '#inbox',
    label: 'Inbox',
    icon: Inbox,
    children: [
      { href: '/admin/inbox/service-requests', label: 'Service Requests', icon: MessageSquare },
      { href: '/admin/inbox/training-applications', label: 'Training Applications', icon: GraduationCap },
      { href: '/admin/inbox/messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  { href: '/admin/users', label: 'Users', icon: UserCog, roles: ['super_admin'] },
  { href: '/admin/activity', label: 'Activity Log', icon: Activity, roles: ['super_admin', 'editor'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['#content']);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    adminMe()
      .then(setUser)
      .catch(() => {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      router.push('/admin/login');
    }
  };

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return user ? item.roles.includes(user.role) : false;
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const NavLink = ({ item, indent = false }: { item: NavItem; indent?: boolean }) => {
    if (!canAccess(item)) return null;

    if (item.children) {
      const isExpanded = expandedGroups.includes(item.href);
      const hasActiveChild = item.children.some((c) => isActive(c.href));
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleGroup(item.href)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              hasActiveChild
                ? 'text-white bg-white/10'
                : 'text-white/80 hover:text-white hover:bg-white/8'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform opacity-60 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && (
            <div className="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
              {item.children.map((child) => (
                <NavLink key={child.href} item={child} indent />
              ))}
            </div>
          )}
        </div>
      );
    }

    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
          active
            ? 'text-white bg-white/12 font-semibold'
            : 'text-white/80 hover:text-white hover:bg-white/8'
        } ${indent ? '' : ''}`}
        onClick={() => setSidebarOpen(false)}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
        )}
        <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent' : ''}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #7C2D12 0%, #9A3412 100%)' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="flex gap-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9A3412, #C2410C)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
              <Droplets className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <p className="font-bold text-white font-heading text-sm leading-tight">Admin Panel</p>
            <p className="text-white/60 text-xs">VW Engineering</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-3 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/8 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/60 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-red-500/15 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F0F4F8] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 shadow-[4px_0_24px_rgba(124,45,18,0.18)]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 shadow-2xl lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200/70 h-14 flex items-center px-4 gap-4 flex-shrink-0 shadow-sm">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-primary border border-gray-200 hover:border-primary/40 rounded-lg transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </Link>

          {user && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
