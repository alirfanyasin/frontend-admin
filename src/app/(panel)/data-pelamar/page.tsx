"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  FileCheck,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Sparkles,
  X,
  Building2,
  ChevronDown,
  User,
  WifiOff,
  ServerCrash,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";

// Interface untuk response API
interface JobApplication {
  id: number;
  lowongan_id: number;
  user_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "interview";
  feedback: string | null;
  applied_at: string | null;
  reviewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    user_profile: {
      nik: string;
      tanggal_lahir: string;
      jenis_kelamin: string;
      no_telp: string;
      disabilitas: {
        kategori_disabilitas: string;
        tingkat_disabilitas: string;
      } | null;
    } | null;
  };
  lowongan: {
    id: number;
    job_title: string;
    location: string;
    job_type: string;
    perusahaan_profile_id: number;
    perusahaan: {
      id: number;
      nama_perusahaan: string;
      logo?: string;
    } | null;
  };
}

// Error types untuk better handling
interface APIError {
  type: 'NETWORK' | 'SERVER' | 'AUTH' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
  statusCode?: number;
}

// Mock data untuk fallback
const mockApplications: JobApplication[] = [
  {
    id: 1,
    lowongan_id: 1,
    user_id: 1,
    status: "pending",
    feedback: null,
    applied_at: "2025-01-15T10:00:00Z",
    reviewed_at: null,
    accepted_at: null,
    rejected_at: null,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    user: {
      id: 1,
      name: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
      avatar: "",
      user_profile: {
        nik: "3201234567890123",
        tanggal_lahir: "1995-05-15",
        jenis_kelamin: "L",
        no_telp: "08123456789",
        disabilitas: {
          kategori_disabilitas: "Fisik",
          tingkat_disabilitas: "Ringan"
        }
      }
    },
    lowongan: {
      id: 1,
      job_title: "Software Developer",
      location: "Jakarta",
      job_type: "full_time",
      perusahaan_profile_id: 1,
      perusahaan: {
        id: 1,
        nama_perusahaan: "Tech Innovate"
      }
    }
  },
  {
    id: 2,
    lowongan_id: 2,
    user_id: 2,
    status: "reviewed",
    feedback: null,
    applied_at: "2025-01-14T09:30:00Z",
    reviewed_at: "2025-01-16T14:20:00Z",
    accepted_at: null,
    rejected_at: null,
    created_at: "2025-01-14T09:30:00Z",
    updated_at: "2025-01-16T14:20:00Z",
    user: {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@email.com",
      avatar: "",
      user_profile: {
        nik: "3301234567890124",
        tanggal_lahir: "1992-08-20",
        jenis_kelamin: "P",
        no_telp: "08234567890",
        disabilitas: {
          kategori_disabilitas: "Mental",
          tingkat_disabilitas: "Sedang"
        }
      }
    },
    lowongan: {
      id: 2,
      job_title: "UI/UX Designer",
      location: "Bandung",
      job_type: "full_time",
      perusahaan_profile_id: 2,
      perusahaan: {
        id: 2,
        nama_perusahaan: "Creative Studio"
      }
    }
  },
  {
    id: 3,
    lowongan_id: 3,
    user_id: 3,
    status: "interview",
    feedback: null,
    applied_at: "2025-01-12T11:15:00Z",
    reviewed_at: "2025-01-14T16:45:00Z",
    accepted_at: null,
    rejected_at: null,
    created_at: "2025-01-12T11:15:00Z",
    updated_at: "2025-01-15T10:30:00Z",
    user: {
      id: 3,
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      avatar: "",
      user_profile: {
        nik: "3401234567890125",
        tanggal_lahir: "1988-12-10",
        jenis_kelamin: "L",
        no_telp: "08345678901",
        disabilitas: {
          kategori_disabilitas: "Sensorik",
          tingkat_disabilitas: "Berat"
        }
      }
    },
    lowongan: {
      id: 3,
      job_title: "Data Analyst",
      location: "Surabaya",
      job_type: "part_time",
      perusahaan_profile_id: 1,
      perusahaan: {
        id: 1,
        nama_perusahaan: "Tech Innovate"
      }
    }
  },
  {
    id: 4,
    lowongan_id: 4,
    user_id: 4,
    status: "accepted",
    feedback: null,
    applied_at: "2025-01-10T08:00:00Z",
    reviewed_at: "2025-01-11T09:00:00Z",
    accepted_at: "2025-01-13T15:30:00Z",
    rejected_at: null,
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-13T15:30:00Z",
    user: {
      id: 4,
      name: "Maya Sari",
      email: "maya.sari@email.com",
      avatar: "",
      user_profile: {
        nik: "3501234567890126",
        tanggal_lahir: "1990-03-25",
        jenis_kelamin: "P",
        no_telp: "08456789012",
        disabilitas: {
          kategori_disabilitas: "Fisik",
          tingkat_disabilitas: "Ringan"
        }
      }
    },
    lowongan: {
      id: 4,
      job_title: "Marketing Specialist",
      location: "Yogyakarta",
      job_type: "full_time",
      perusahaan_profile_id: 3,
      perusahaan: {
        id: 3,
        nama_perusahaan: "Digital Agency"
      }
    }
  },
  {
    id: 5,
    lowongan_id: 5,
    user_id: 5,
    status: "rejected",
    feedback: "Pengalaman kurang sesuai dengan requirement yang dibutuhkan untuk posisi ini. Silakan melamar kembali setelah mendapat pengalaman yang relevan.",
    applied_at: "2025-01-08T13:20:00Z",
    reviewed_at: "2025-01-09T10:15:00Z",
    accepted_at: null,
    rejected_at: "2025-01-09T10:15:00Z",
    created_at: "2025-01-08T13:20:00Z",
    updated_at: "2025-01-09T10:15:00Z",
    user: {
      id: 5,
      name: "Doni Prasetyo",
      email: "doni.prasetyo@email.com",
      avatar: "",
      user_profile: {
        nik: "3601234567890127",
        tanggal_lahir: "1993-07-18",
        jenis_kelamin: "L",
        no_telp: "08567890123",
        disabilitas: {
          kategori_disabilitas: "Mental",
          tingkat_disabilitas: "Ringan"
        }
      }
    },
    lowongan: {
      id: 5,
      job_title: "Project Manager",
      location: "Medan",
      job_type: "contract",
      perusahaan_profile_id: 2,
      perusahaan: {
        id: 2,
        nama_perusahaan: "Creative Studio"
      }
    }
  }
];

export default function AllApplicantsPage() {
  // Development mode flag - set to false to disable API calls entirely
  const DEVELOPMENT_MODE = true;
  const USE_MOCK_DATA_ONLY = true; // Set to true to skip API calls completely
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
    interview: 0,
  });
  const [companies, setCompanies] = useState<Array<{id: number; nama_perusahaan: string}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIError | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);
  const [showApplicantModal, setShowApplicantModal] = useState<boolean>(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Client-side filtering dan sorting
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (app) =>
          app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.lowongan.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.lowongan.perusahaan?.nama_perusahaan || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Company filter
    if (companyFilter !== "all") {
      filtered = filtered.filter((app) => 
        app.lowongan.perusahaan_profile_id.toString() === companyFilter
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return a.user.name.localeCompare(b.user.name);
        case "company":
          return (a.lowongan.perusahaan?.nama_perusahaan || "").localeCompare(
            b.lowongan.perusahaan?.nama_perusahaan || ""
          );
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, companyFilter, sortBy]);

  // Enhanced error categorization
  const categorizeError = (error: any): APIError => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        // Network error
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return {
            type: 'TIMEOUT',
            message: 'Koneksi timeout. Server membutuhkan waktu terlalu lama untuk merespons.'
          };
        }
        return {
          type: 'NETWORK',
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        };
      }
      
      const status = error.response.status;
      switch (status) {
        case 401:
          return {
            type: 'AUTH',
            message: 'Sesi Anda telah berakhir. Silakan login kembali.',
            statusCode: status
          };
        case 403:
          return {
            type: 'AUTH',
            message: 'Anda tidak memiliki izin untuk mengakses data ini.',
            statusCode: status
          };
        case 404:
          return {
            type: 'SERVER',
            message: 'Endpoint tidak ditemukan. API mungkin belum tersedia.',
            statusCode: status
          };
        case 500:
          return {
            type: 'SERVER',
            message: 'Terjadi kesalahan pada server. Tim teknis sedang memperbaiki masalah ini.',
            statusCode: status
          };
        case 502:
        case 503:
        case 504:
          return {
            type: 'SERVER',
            message: 'Server sedang dalam maintenance atau overload. Coba lagi dalam beberapa saat.',
            statusCode: status
          };
        default:
          return {
            type: 'SERVER',
            message: `Server mengembalikan error ${status}. Silakan hubungi administrator.`,
            statusCode: status
          };
      }
    }
    
    return {
      type: 'UNKNOWN',
      message: error.message || 'Terjadi kesalahan yang tidak diketahui.'
    };
  };

  const fetchAllData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);

      // If we're in development mode and want to use mock data only, skip API calls
      if (DEVELOPMENT_MODE && USE_MOCK_DATA_ONLY) {
        console.log("🧪 Development mode: Using mock data only");
        setUsingMockData(true);
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        calculateStatsFromData(mockApplications);
        extractCompaniesFromData(mockApplications);
        return;
      }

      // Try to fetch real data with retry mechanism
      await fetchWithRetry();

    } catch (err) {
      if (!USE_MOCK_DATA_ONLY) {
        const categorizedError = categorizeError(err);
        console.warn("API calls failed, using mock data:", categorizedError);
        
        // Set error for display
        setError(categorizedError);
      }
      
      // Fallback to mock data
      setUsingMockData(true);
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      calculateStatsFromData(mockApplications);
      extractCompaniesFromData(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithRetry = async (retries = 2): Promise<void> => {
    for (let i = 0; i <= retries; i++) {
      try {
        // Batch all API calls with individual error handling
        const results = await Promise.allSettled([
          fetchApplications(),
          fetchStats(),
          fetchCompanies()
        ]);

        // Check if at least the main applications call succeeded
        const applicationsResult = results[0];
        if (applicationsResult.status === 'rejected') {
          throw applicationsResult.reason;
        }

        // Success - break out of retry loop
        break;
      } catch (error) {
        if (i === retries) {
          // Last retry failed
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  };

  const fetchApplications = async (): Promise<void> => {
    try {
      // Add a check to see if we should even attempt the API call
      // You can add a flag or environment variable to control this
      const shouldUseAPI = false; // Set to true when backend is ready
      
      if (!shouldUseAPI) {
        throw new Error("API temporarily disabled - using mock data");
      }

      const response = await apiBissaKerja.get('/admin/all-applicants', {
        timeout: 10000, // Increased timeout to 10 seconds
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        const applicationsData = Array.isArray(response.data.data) ? response.data.data : [];
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        // Calculate stats from the fetched data if stats API fails
        calculateStatsFromData(applicationsData);
      } else {
        throw new Error(response.data?.message || "Invalid response format from server");
      }
    } catch (error) {
      // Suppress console.error to avoid cluttering the console during development
      // console.error("Failed to fetch applications:", error);
      throw error;
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      // Skip API call for now - using calculated stats instead
      return;
      
      const response = await apiBissaKerja.get('/admin/applicants/stats', {
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.success && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      // Silently fail - stats will be calculated from applications
    }
  };

  const fetchCompanies = async (): Promise<void> => {
    try {
      // Skip API call for now - using extracted companies instead
      return;
      
      const response = await apiBissaKerja.get('/admin/companies', {
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      // Silently fail - companies will be extracted from applications
    }
  };

  const calculateStatsFromData = (data: JobApplication[]) => {
    const statsCalc = {
      total: data.length,
      pending: data.filter((app) => app.status === "pending").length,
      reviewed: data.filter((app) => app.status === "reviewed").length,
      accepted: data.filter((app) => app.status === "accepted").length,
      rejected: data.filter((app) => app.status === "rejected").length,
      interview: data.filter((app) => app.status === "interview").length,
    };
    setStats(statsCalc);
  };

  const extractCompaniesFromData = (data: JobApplication[]) => {
    const uniqueCompanies = data.reduce((companies, app) => {
      const company = app.lowongan.perusahaan;
      if (company && !companies.find(c => c.id === company.id)) {
        companies.push(company);
      }
      return companies;
    }, [] as Array<{id: number; nama_perusahaan: string}>);
    setCompanies(uniqueCompanies);
  };

  const handleRefresh = async () => {
    await fetchAllData();
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Menunggu",
          color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
          icon: Clock,
        };
      case "reviewed":
        return {
          label: "Direview",
          color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          icon: FileCheck,
        };
      case "accepted":
        return {
          label: "Diterima",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Ditolak",
          color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
          icon: XCircle,
        };
      case "interview":
        return {
          label: "Interview",
          color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
          icon: MessageSquare,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600",
          icon: AlertCircle,
        };
    }
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'NETWORK':
        return WifiOff;
      case 'TIMEOUT':
        return Clock;
      case 'SERVER':
        return ServerCrash;
      case 'AUTH':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(target.alt || "User") + "&background=6366f1&color=fff&size=128";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <PageBreadcrumb pageTitle="Data Pelamar" />
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <PageBreadcrumb pageTitle="Data Pelamar" />

      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Users className="w-7 h-7 mr-3 text-blue-500 dark:text-blue-400" />
                Data Pelamar
                {usingMockData && (
                  <span className="ml-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    Demo Data
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Semua data pelamar dari seluruh perusahaan yang terdaftar
                {USE_MOCK_DATA_ONLY && (
                  <span className="block text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Mode development: Menggunakan data demo karena backend sedang dalam pengembangan
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 p-6">
            <div className="flex items-start space-x-4">
              {React.createElement(getErrorIcon(error.type), {
                className: "w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1"
              })}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  {error.type === 'NETWORK' ? 'Masalah Koneksi' :
                   error.type === 'TIMEOUT' ? 'Timeout' :
                   error.type === 'SERVER' ? 'Masalah Server' :
                   error.type === 'AUTH' ? 'Masalah Autentikasi' : 'Kesalahan Sistem'}
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mb-3">
                  {error.message}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Aplikasi akan menggunakan data demo untuk saat ini. Silakan refresh halaman untuk mencoba lagi.
                </p>
                {error.statusCode && (
                  <p className="text-xs text-amber-500 dark:text-amber-500 mt-2">
                    Status Code: {error.statusCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Pelamar", value: stats.total, color: "blue", icon: Users },
            { label: "Menunggu", value: stats.pending, color: "amber", icon: Clock },
            { label: "Direview", value: stats.reviewed, color: "blue", icon: FileCheck },
            { label: "Interview", value: stats.interview, color: "purple", icon: MessageSquare },
            { label: "Diterima", value: stats.accepted, color: "emerald", icon: CheckCircle },
            { label: "Ditolak", value: stats.rejected, color: "red", icon: XCircle },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
              purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
              emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
              red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
            };

            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[0]}`}>
                    {stat.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari nama, email, posisi, atau perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white w-full"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="reviewed">Direview</option>
                <option value="interview">Interview</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            {/* Company Filter */}
            <div className="relative">
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white w-full"
              >
                <option value="all">Semua Perusahaan</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id.toString()}>
                    {company.nama_perusahaan}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4">
            <div className="relative max-w-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white w-full"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name">Nama A-Z</option>
                <option value="company">Perusahaan A-Z</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tidak Ada Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== "all" || companyFilter !== "all"
                  ? "Tidak ada pelamar yang sesuai dengan filter"
                  : "Belum ada data pelamar"}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Applicant Info */}
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        {application.user.avatar ? (
                          <img
                            src={application.user.avatar}
                            alt={application.user.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-white dark:border-gray-700 shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {application.user.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {application.user.email}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color} flex items-center flex-shrink-0`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">{statusConfig.label}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center min-w-0">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <span className="truncate font-medium">{application.lowongan.job_title}</span>
                          </div>
                          <div className="flex items-center min-w-0">
                            <Building2 className="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0" />
                            <span className="truncate">{application.lowongan.perusahaan?.nama_perusahaan || "N/A"}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                            <span className="truncate">{application.lowongan.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                            <span className="truncate">Melamar: {formatDate(application.applied_at || application.created_at)}</span>
                          </div>
                          {application.user.user_profile?.no_telp && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                              <span className="truncate">{application.user.user_profile.no_telp}</span>
                            </div>
                          )}
                          {application.user.user_profile?.disabilitas && (
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2 text-red-500 dark:text-red-400 flex-shrink-0" />
                              <span className="truncate text-xs">
                                {application.user.user_profile.disabilitas.kategori_disabilitas}
                              </span>
                            </div>
                          )}
                        </div>

                        {application.status === "rejected" && application.feedback && (
                          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-300">
                              <span className="font-medium">Feedback: </span>
                              {application.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedApplicant(application);
                          setShowApplicantModal(true);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal for Applicant Detail */}
      {showApplicantModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedApplicant.user.avatar ? (
                    <img
                      src={selectedApplicant.user.avatar}
                      alt={selectedApplicant.user.name}
                      className="w-16 h-16 rounded-xl object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedApplicant.user.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedApplicant.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicantModal(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Posisi:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedApplicant.lowongan.job_title}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Perusahaan:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedApplicant.lowongan.perusahaan?.nama_perusahaan || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Lokasi:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedApplicant.lowongan.location}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedApplicant.status).color}`}>
                    {React.createElement(getStatusConfig(selectedApplicant.status).icon, { className: "w-4 h-4 mr-2" })}
                    {getStatusConfig(selectedApplicant.status).label}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Tanggal Melamar:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDate(selectedApplicant.applied_at || selectedApplicant.created_at)}
                  </p>
                </div>
                {selectedApplicant.user.user_profile?.no_telp && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">No. Telepon:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedApplicant.user.user_profile.no_telp}
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              {selectedApplicant.user.user_profile && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informasi Pribadi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {selectedApplicant.user.user_profile.nik && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">NIK:</span>
                        <p className="text-gray-900 dark:text-white font-mono">
                          {selectedApplicant.user.user_profile.nik}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.user.user_profile.tanggal_lahir && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Tanggal Lahir:</span>
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(selectedApplicant.user.user_profile.tanggal_lahir)}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.user.user_profile.jenis_kelamin && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Jenis Kelamin:</span>
                        <p className="text-gray-900 dark:text-white">
                          {selectedApplicant.user.user_profile.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.user.user_profile.disabilitas && (
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Informasi Disabilitas:</span>
                        <p className="text-gray-900 dark:text-white">
                          {selectedApplicant.user.user_profile.disabilitas.kategori_disabilitas} - {selectedApplicant.user.user_profile.disabilitas.tingkat_disabilitas}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback if rejected */}
              {selectedApplicant.status === "rejected" && selectedApplicant.feedback && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Feedback Penolakan</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {selectedApplicant.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}