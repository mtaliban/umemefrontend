'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Search, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { adminList, adminDelete, adminPublish, adminUnpublish, adminReorder } from '@/lib/api';
import type { ListResponse } from '@/lib/types';
import SortableItem from './SortableItem';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface ContentListProps<T extends { _id: string; sort?: number; status?: string }> {
  collection: string;
  title: string;
  addHref?: string;
  editHref?: (item: T) => string;
  columns: Column<T>[];
  hasPublish?: boolean;
  hasSort?: boolean;
}

export default function ContentList<T extends { _id: string; sort?: number; status?: string }>({
  collection,
  title,
  addHref,
  editHref,
  columns,
  hasPublish = false,
  hasSort = false,
}: ContentListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminList<T>(collection, {
        q: search || undefined,
        status: statusFilter || undefined,
        page,
      });
      setItems(result.items);
      setTotalPages(result.pages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [collection, search, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await adminDelete(collection, id);
      setConfirmDelete(null);
      load();
    } catch {
      // show error
    }
  };

  const handleTogglePublish = async (item: T) => {
    try {
      if (item.status === 'published') {
        await adminUnpublish(collection, item._id);
      } else {
        await adminPublish(collection, item._id);
      }
      load();
    } catch {
      // show error
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      await adminReorder(collection, newItems.map((i) => i._id));
    } catch {
      load(); // revert on error
    }
  };

  const getCell = (item: T, col: Column<T>) => {
    if (col.render) return col.render(item);
    const val = (item as Record<string, unknown>)[col.key as string];
    if (typeof val === 'object' && val !== null && 'en' in val) {
      return String((val as { en: string }).en);
    }
    return String(val ?? '');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">{title}</h1>
        {addHref && (
          <Link
            href={addHref}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-orange-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {hasPublish && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No items found</p>
        ) : (
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((i) => i._id)}
                strategy={verticalListSortingStrategy}
              >
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-gray-100">
                    <tr>
                      {hasSort && <th className="w-8 p-3" />}
                      {columns.map((col) => (
                        <th key={String(col.key)} className="text-left p-3 font-semibold text-gray-700">
                          {col.label}
                        </th>
                      ))}
                      {hasPublish && <th className="text-left p-3 font-semibold text-gray-700 w-24">Status</th>}
                      <th className="text-right p-3 font-semibold text-gray-700 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <SortableItem key={item._id} id={item._id}>
                        <tr className="border-t border-gray-50 hover:bg-surface/50">
                          {columns.map((col) => (
                            <td key={String(col.key)} className="p-3 text-gray-700">
                              {getCell(item, col)}
                            </td>
                          ))}
                          {hasPublish && (
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => handleTogglePublish(item)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                  item.status === 'published'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {item.status === 'published' ? (
                                  <><Eye className="w-3 h-3" /> Published</>
                                ) : (
                                  <><EyeOff className="w-3 h-3" /> Draft</>
                                )}
                              </button>
                            </td>
                          )}
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-1">
                              {editHref && (
                                <Link
                                  href={editHref(item)}
                                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                  aria-label="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                              )}
                              {confirmDelete === item._id ? (
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(item._id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  aria-label="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </SortableItem>
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-surface"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-surface"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
