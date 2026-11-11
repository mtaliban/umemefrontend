import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  light?: boolean;
}

export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  const textColor = light ? 'text-white/80' : 'text-gray-500';
  const activeColor = light ? 'text-white' : 'text-gray-900';
  const hoverColor = light ? 'hover:text-white' : 'hover:text-primary';

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex flex-wrap items-center gap-1 text-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <ChevronRight className={`w-3.5 h-3.5 ${textColor}`} aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span className={`font-medium ${activeColor}`} itemProp="name">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`${textColor} ${hoverColor} transition-colors`}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
