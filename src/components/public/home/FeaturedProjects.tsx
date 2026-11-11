import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

interface FeaturedProjectsProps {
  projects: Project[];
  locale: string;
  viewAllLabel: string;
}

export default function FeaturedProjects({ projects, locale, viewAllLabel }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title">
              {locale === 'sw' ? 'Miradi Iliyoangaziwa' : 'Featured Projects'}
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-sm group"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden bg-primary/10">
                {project.cover?.url ? (
                  <Image
                    src={project.cover.url}
                    alt={resolveT(project.cover.alt) || resolveT(project.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-5xl font-bold font-heading">
                      {resolveT(project.title).charAt(0)}
                    </span>
                  </div>
                )}
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    project.project_status === 'completed'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}>
                    {project.project_status === 'completed'
                      ? (locale === 'sw' ? 'Imekamilika' : 'Completed')
                      : (locale === 'sw' ? 'Inaendelea' : 'Ongoing')}
                  </span>
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-1 text-base">
                  {resolveT(project.title)}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-accent-dark" />
                  <span className="line-clamp-1">
                    {project.location ?? project.region ?? ''}
                  </span>
                </div>
                {project.end_date && (
                  <p className="mt-1.5 text-xs text-gray-400 font-medium">
                    {new Date(project.end_date).getFullYear()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
