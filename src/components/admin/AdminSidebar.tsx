'use client';

import Link from 'next/link';
import {
  LayoutDashboard, Settings, Images, BarChart3, Shield, Workflow,
  FileText, Users, Award, Briefcase, FolderKanban, GraduationCap,
  Building, Star, Newspaper, Camera, HelpCircle, MapPin, Download,
  Inbox, MessageSquare, UserCog, Activity, ChevronDown, Zap, Droplets,
} from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
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
      { href: '/admin/content/hero-slides', label: 'Hero Slides', icon: Images },
      { href: '/admin/content/stats', label: 'Statistics', icon: BarChart3 },
      { href: '/admin/content/features', label: 'Why Choose Us', icon: Shield },
      { href: '/admin/content/work-steps', label: 'How We Work', icon: Workflow },
      { href: '/admin/content/pages', label: 'Pages', icon: FileText },
      { href: '/admin/content/team', label: 'Team Members', icon: Users },
      { href: '/admin/content/certifications', label: 'Certifications', icon: Award },
      { href: '/admin/content/services', label: 'Services', icon: Briefcase },
      { href: '/admin/content/service-categories', label: 'Service Categories', icon: FolderKanban },
      { href: '/admin/content/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/content/training', label: 'Training', icon: GraduationCap },
      { href: '/admin/content/training-intakes', label: 'Training Intakes', icon: GraduationCap },
      { href: '/admin/content/training-steps', label: 'Training Steps', icon: Workflow },
      { href: '/admin/content/clients', label: 'Clients', icon: Building },
      { href: '/admin/content/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/content/posts', label: 'Posts / News', icon: Newspaper },
      { href: '/admin/content/gallery', label: 'Gallery', icon: Camera },
      { href: '/admin/content/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/admin/content/offices', label: 'Offices', icon: MapPin },
      { href: '/admin/content/downloads', label: 'Downloads', icon: Download },
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
  {
    href: '/admin/activity',
    label: 'Activity Log',
    icon: Activity,
    roles: ['super_admin', 'editor'],
  },
];

interface AdminSidebarProps {
  role: UserRole;
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ role, currentPath, isOpen, onClose }: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['#content']);

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  };

  const NavLink = ({ item, indent = false }: { item: NavItem; indent?: boolean }) => {
    if (!canAccess(item)) return null;

    if (item.children) {
      const isExpanded = expandedGroups.includes(item.href);
      const accessibleChildren = item.children.filter(canAccess);
      if (accessibleChildren.length === 0) return null;
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleGroup(item.href)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {isExpanded && (
            <div className="mt-0.5 ml-3 pl-3 border-l border-gray-200 space-y-0.5">
              {accessibleChildren.map((child) => (
                <NavLink key={child.href} item={child} indent />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive(item.href)
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } ${indent ? '' : ''}`}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <span className="font-bold text-gray-900 font-heading text-sm">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
