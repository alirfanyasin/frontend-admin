"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download,
  AlertTriangle,
  Users,
  Shield,
  ShieldAlert,
  ChevronRight,
  MoreVertical
} from "lucide-react";

// ========================
// TYPES & INTERFACES
// ========================
interface DisabilitasItem {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface Statistics {
  total: number;
  ringan: number;
  sedang: number;
  berat: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
  statistics?: Statistics;
  tingkat_options?: string[];
}

// ========================
// CONSTANTS
// ========================
const TINGKAT_OPTIONS = ["Ringan", "Sedang", "Berat"];
const API_BASE_URL = "http://localhost:8000/api/disability"; // Laravel development server

// ========================
// API FUNCTIONS
// ========================
const api = {
  async get(url: string, params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}${url}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post(url: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  async put(url: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  async delete(url: string) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST', // Using POST as per your route definition
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  }
};

// ========================
// MAIN COMPONENT
// ========================
const MenuDisabilitasPage: React.FC = () => {
  // ========================
  // STATE MANAGEMENT
  // ========================
  const [data, setData] = useState<DisabilitasItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    ringan: 0,
    sedang: 0,
    berat: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DisabilitasItem | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    kategori_disabilitas: "",
    tingkat_disabilitas: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================
  // API FUNCTIONS
  // ========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        per_page: itemsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedFilter !== "all") {
        params.tingkat = selectedFilter;
      }

      const response: ApiResponse = await api.get('/', params);
      
      if (response.success) {
        setData(response.data.data || []);
        setStatistics(response.statistics || { total: 0, ringan: 0, sedang: 0, berat: 0 });
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error - show notification or set error state
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedFilter]);

  // ========================
  // EFFECTS
  // ========================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedFilter]);

  // ========================
  // UTILITY FUNCTIONS
  // ========================
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setFormData({
      kategori_disabilitas: "",
      tingkat_disabilitas: ""
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.kategori_disabilitas.trim()) {
      errors.kategori_disabilitas = "Kategori disabilitas harus diisi";
    }

    if (!formData.tingkat_disabilitas) {
      errors.tingkat_disabilitas = "Tingkat disabilitas harus dipilih";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // ========================
  // EVENT HANDLERS
  // ========================
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response: ApiResponse = await api.post('/create-disability', formData);
      
      if (response.success) {
        setShowAddModal(false);
        resetForm();
        fetchData(); // Refresh data
        // Show success notification
        console.log(response.message);
      }
    } catch (error: any) {
      if (error.errors) {
        // Handle validation errors from server
        setFormErrors(error.errors);
      } else {
        // Handle other errors
        console.error('Error creating disabilitas:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedItem || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response: ApiResponse = await api.put(`/update-disability/${selectedItem.id}`, formData);
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedItem(null);
        resetForm();
        fetchData(); // Refresh data
        // Show success notification
        console.log(response.message);
      }
    } catch (error: any) {
      if (error.errors) {
        // Handle validation errors from server
        setFormErrors(error.errors);
      } else {
        // Handle other errors
        console.error('Error updating disabilitas:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: DisabilitasItem) => {
    setSelectedItem(item);
    setFormData({
      kategori_disabilitas: item.kategori_disabilitas,
      tingkat_disabilitas: item.tingkat_disabilitas
    });
    setShowEditModal(true);
  };

  const handleDelete = (item: DisabilitasItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response: ApiResponse = await api.delete(`/delete-disability/${selectedItem.id}`);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedItem(null);
        fetchData(); // Refresh data
        // Show success notification
        console.log(response.message);
      }
    } catch (error: any) {
      console.error('Error deleting disabilitas:', error.message);
      // Handle error - show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      // Get all data for export (without pagination)
      const response: ApiResponse = await api.get('/', {
        per_page: 1000, // Get all data
        search: searchTerm,
        tingkat: selectedFilter !== 'all' ? selectedFilter : undefined
      });

      if (response.success && response.data.data) {
        // Create CSV content
        const headers = ['No', 'Kategori Disabilitas', 'Tingkat Disabilitas', 'Dibuat Tanggal', 'Diupdate Tanggal'];
        const csvContent = [
          headers.join(','),
          ...response.data.data.map((item: DisabilitasItem, index: number) => [
            index + 1,
            `"${item.kategori_disabilitas}"`,
            `"${item.tingkat_disabilitas}"`,
            `"${formatDate(item.created_at)}"`,
            `"${formatDate(item.updated_at)}"`
          ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `data-disabilitas-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      // Handle error - show error notification
    }
  };

  // ========================
  // RENDER FUNCTIONS
  // ========================
  const renderBreadcrumb = () => (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Home</span>
      <ChevronRight size={16} className="mx-2" />
      <span className="text-gray-900 dark:text-white font-medium">Menu Disabilitas</span>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <div className="p-6">
        {renderBreadcrumb()}
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Menu Disabilitas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelola data kategori dan tingkat disabilitas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
            >
              <Plus size={16} className="mr-2" />
              Tambah Disabilitas
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kategori disabilitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none transition-all duration-200"
            >
              <option value="all">Semua Tingkat</option>
              {TINGKAT_OPTIONS.map(tingkat => (
                <option key={tingkat} value={tingkat}>{tingkat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Disabilitas
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Tingkat Ringan
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {statistics.ringan}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Tingkat Sedang
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {statistics.sedang}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Tingkat Berat
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {statistics.berat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategori Disabilitas
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tingkat Disabilitas
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Terakhir Diupdate
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-base">
                      {searchTerm || selectedFilter !== "all" ? "Tidak ada data yang sesuai dengan filter" : "Belum ada data disabilitas"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.kategori_disabilitas}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      item.tingkat_disabilitas === 'Ringan' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      item.tingkat_disabilitas === 'Sedang' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {item.tingkat_disabilitas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-150"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-md transition-colors duration-150"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{" "}
              <span className="font-medium">{endIndex}</span> dari{" "}
              <span className="font-medium">{totalItems}</span> hasil
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Sebelumnya
              </button>
              <div className="flex items-center space-x-1">
                {getVisiblePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(page as number)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ========================
  // MODALS
  // ========================
  const renderAddModal = () => (
    showAddModal && (
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Tambah Data Disabilitas
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori Disabilitas *
                </label>
                <input
                  type="text"
                  value={formData.kategori_disabilitas}
                  onChange={(e) => setFormData(prev => ({ ...prev, kategori_disabilitas: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-150 ${
                    formErrors.kategori_disabilitas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan kategori disabilitas"
                  disabled={isSubmitting}
                />
                {formErrors.kategori_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {Array.isArray(formErrors.kategori_disabilitas) 
                      ? formErrors.kategori_disabilitas[0] 
                      : formErrors.kategori_disabilitas}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tingkat Disabilitas *
                </label>
                <select
                  value={formData.tingkat_disabilitas}
                  onChange={(e) => setFormData(prev => ({ ...prev, tingkat_disabilitas: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-150 ${
                    formErrors.tingkat_disabilitas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Pilih tingkat disabilitas</option>
                  {TINGKAT_OPTIONS.map(tingkat => (
                    <option key={tingkat} value={tingkat}>{tingkat}</option>
                  ))}
                </select>
                {formErrors.tingkat_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {Array.isArray(formErrors.tingkat_disabilitas) 
                      ? formErrors.tingkat_disabilitas[0] 
                      : formErrors.tingkat_disabilitas}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );

  const renderEditModal = () => (
    showEditModal && (
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Edit Data Disabilitas
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori Disabilitas *
                </label>
                <input
                  type="text"
                  value={formData.kategori_disabilitas}
                  onChange={(e) => setFormData(prev => ({ ...prev, kategori_disabilitas: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-150 ${
                    formErrors.kategori_disabilitas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan kategori disabilitas"
                  disabled={isSubmitting}
                />
                {formErrors.kategori_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {Array.isArray(formErrors.kategori_disabilitas) 
                      ? formErrors.kategori_disabilitas[0] 
                      : formErrors.kategori_disabilitas}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tingkat Disabilitas *
                </label>
                <select
                  value={formData.tingkat_disabilitas}
                  onChange={(e) => setFormData(prev => ({ ...prev, tingkat_disabilitas: e.target.value }))}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-150 ${
                    formErrors.tingkat_disabilitas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Pilih tingkat disabilitas</option>
                  {TINGKAT_OPTIONS.map(tingkat => (
                    <option key={tingkat} value={tingkat}>{tingkat}</option>
                  ))}
                </select>
                {formErrors.tingkat_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {Array.isArray(formErrors.tingkat_disabilitas) 
                      ? formErrors.tingkat_disabilitas[0] 
                      : formErrors.tingkat_disabilitas}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  {isSubmitting ? 'Memperbarui...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );

  const renderDeleteModal = () => (
    showDeleteModal && selectedItem && (
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Konfirmasi Hapus
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus data disabilitas <span className="font-medium text-gray-900 dark:text-white">"{selectedItem.kategori_disabilitas}"</span> dengan tingkat <span className="font-medium text-gray-900 dark:text-white">"{selectedItem.tingkat_disabilitas}"</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // ========================
  // MAIN RENDER
  // ========================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className={`p-6 transition-all duration-300 ${
        (showEditModal || showAddModal || showDeleteModal) ? 'blur-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto">
          {renderHeader()}
          {renderTable()}
        </div>
      </div>
      
      {/* Modals */}
      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default MenuDisabilitasPage;