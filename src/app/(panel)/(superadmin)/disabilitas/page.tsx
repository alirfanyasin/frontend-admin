"use client";

import React, { useState, useEffect } from "react";
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
  id: string;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

// ========================
// INITIAL MOCK DATA
// ========================
const INITIAL_MOCK_DATA: DisabilitasItem[] = [
  {
    id: "1",
    kategori_disabilitas: "Tuna Netra",
    tingkat_disabilitas: "Sedang",
    createdAt: "2025-08-15T10:30:00Z",
    updatedAt: "2025-08-15T10:30:00Z"
  },
  {
    id: "2",
    kategori_disabilitas: "Tuna Daksa",
    tingkat_disabilitas: "Ringan",
    createdAt: "2025-08-16T14:20:00Z",
    updatedAt: "2025-08-16T14:20:00Z"
  },
  {
    id: "3",
    kategori_disabilitas: "Tuna Rungu",
    tingkat_disabilitas: "Berat",
    createdAt: "2025-08-17T09:15:00Z",
    updatedAt: "2025-08-17T09:15:00Z"
  },
  {
    id: "4",
    kategori_disabilitas: "Tuna Grahita",
    tingkat_disabilitas: "Ringan",
    createdAt: "2025-08-18T11:45:00Z",
    updatedAt: "2025-08-18T11:45:00Z"
  },
  {
    id: "5",
    kategori_disabilitas: "Tuna Laras",
    tingkat_disabilitas: "Sedang",
    createdAt: "2025-08-19T16:20:00Z",
    updatedAt: "2025-08-19T16:20:00Z"
  },
  {
    id: "6",
    kategori_disabilitas: "Tuna Wicara",
    tingkat_disabilitas: "Berat",
    createdAt: "2025-08-20T08:30:00Z",
    updatedAt: "2025-08-20T08:30:00Z"
  },
  {
    id: "7",
    kategori_disabilitas: "Autis",
    tingkat_disabilitas: "Ringan",
    createdAt: "2025-08-21T13:15:00Z",
    updatedAt: "2025-08-21T13:15:00Z"
  },
  {
    id: "8",
    kategori_disabilitas: "Down Syndrome",
    tingkat_disabilitas: "Sedang",
    createdAt: "2025-08-22T15:45:00Z",
    updatedAt: "2025-08-22T15:45:00Z"
  },
  {
    id: "9",
    kategori_disabilitas: "Cerebral Palsy",
    tingkat_disabilitas: "Berat",
    createdAt: "2025-08-23T11:20:00Z",
    updatedAt: "2025-08-23T11:20:00Z"
  },
  {
    id: "10",
    kategori_disabilitas: "Tuna Ganda",
    tingkat_disabilitas: "Berat",
    createdAt: "2025-08-24T09:40:00Z",
    updatedAt: "2025-08-24T09:40:00Z"
  },
  {
    id: "11",
    kategori_disabilitas: "ADHD",
    tingkat_disabilitas: "Ringan",
    createdAt: "2025-08-25T14:10:00Z",
    updatedAt: "2025-08-25T14:10:00Z"
  },
  {
    id: "12",
    kategori_disabilitas: "Disleksia",
    tingkat_disabilitas: "Sedang",
    createdAt: "2025-08-26T10:55:00Z",
    updatedAt: "2025-08-26T10:55:00Z"
  }
];

const TINGKAT_OPTIONS = ["Ringan", "Sedang", "Berat"];

// ========================
// STORAGE SIMULATION
// ========================
// Simulasi penyimpanan menggunakan variable global
let globalDataStore: DisabilitasItem[] = [...INITIAL_MOCK_DATA];

const saveToStorage = (data: DisabilitasItem[]) => {
  globalDataStore = [...data];
  // Simulasi API call untuk menyimpan data
  console.log('Data saved to persistent storage:', data);
};

const loadFromStorage = (): DisabilitasItem[] => {
  // Simulasi loading dari persistent storage
  return [...globalDataStore];
};

// ========================
// MAIN COMPONENT
// ========================
const MenuDisabilitasPage: React.FC = () => {
  // ========================
  // STATE MANAGEMENT
  // ========================
  const [data, setData] = useState<DisabilitasItem[]>([]);
  const [filteredData, setFilteredData] = useState<DisabilitasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
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

  // ========================
  // EFFECTS
  // ========================
  useEffect(() => {
    // Load data from persistent storage on component mount
    const loadData = () => {
      setLoading(true);
      try {
        const savedData = loadFromStorage();
        setData(savedData);
        setFilteredData(savedData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to initial mock data if loading fails
        setData(INITIAL_MOCK_DATA);
        setFilteredData(INITIAL_MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.kategori_disabilitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tingkat_disabilitas.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tingkat
    if (selectedFilter !== "all") {
      filtered = filtered.filter(item => item.tingkat_disabilitas === selectedFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [data, searchTerm, selectedFilter]);

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

  const generateId = () => {
    return Date.now().toString();
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

  // Calculate statistics
  const totalData = data.length;
  const ringanCount = data.filter(item => item.tingkat_disabilitas === "Ringan").length;
  const sedangCount = data.filter(item => item.tingkat_disabilitas === "Sedang").length;
  const beratCount = data.filter(item => item.tingkat_disabilitas === "Berat").length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
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
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newItem: DisabilitasItem = {
      id: generateId(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedData = [...data, newItem];
    setData(updatedData);
    
    // Save to persistent storage
    saveToStorage(updatedData);
    
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedItem) return;

    const updatedData = data.map(item => 
      item.id === selectedItem.id 
        ? { ...item, ...formData, updatedAt: new Date().toISOString() }
        : item
    );
    
    setData(updatedData);
    
    // Save to persistent storage
    saveToStorage(updatedData);

    setShowEditModal(false);
    setSelectedItem(null);
    resetForm();
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

  const confirmDelete = () => {
    if (selectedItem) {
      const updatedData = data.filter(item => item.id !== selectedItem.id);
      setData(updatedData);
      
      // Save to persistent storage
      saveToStorage(updatedData);
      
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['No', 'Kategori Disabilitas', 'Tingkat Disabilitas', 'Dibuat Tanggal', 'Diupdate Tanggal'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item, index) => [
        index + 1,
        `"${item.kategori_disabilitas}"`,
        `"${item.tingkat_disabilitas}"`,
        `"${formatDate(item.createdAt)}"`,
        `"${formatDate(item.updatedAt)}"`
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
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
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
              placeholder="Cari kategori"
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
              <option value="all">Semua Status</option>
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
                  {totalData}
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
                  {ringanCount}
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
                  {sedangCount}
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
                  {beratCount}
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
            ) : filteredData.length === 0 ? (
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
              currentPageData.map((item, index) => (
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
                    {formatDate(item.updatedAt)}
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
      {filteredData.length > itemsPerPage && (
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{" "}
              <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> dari{" "}
              <span className="font-medium">{filteredData.length}</span> hasil
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
                />
                {formErrors.kategori_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.kategori_disabilitas}
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
                >
                  <option value="">Pilih tingkat disabilitas</option>
                  {TINGKAT_OPTIONS.map(tingkat => (
                    <option key={tingkat} value={tingkat}>{tingkat}</option>
                  ))}
                </select>
                {formErrors.tingkat_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.tingkat_disabilitas}
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
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm"
                >
                  Simpan
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
                />
                {formErrors.kategori_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.kategori_disabilitas}
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
                >
                  <option value="">Pilih tingkat disabilitas</option>
                  {TINGKAT_OPTIONS.map(tingkat => (
                    <option key={tingkat} value={tingkat}>{tingkat}</option>
                  ))}
                </select>
                {formErrors.tingkat_disabilitas && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.tingkat_disabilitas}
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
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm"
                >
                  Update
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
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-150 shadow-sm"
              >
                Hapus
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