import { NextRequest, NextResponse } from 'next/server';

// Simulasi database untuk provider
// Mengekspor variabel providers agar dapat diimpor oleh file lain
export let providers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@kineticrehab.com",
    image: "/avatars/provider-1.jpg",
    specialty: "Physical Therapy",
    clinic: "Kinetic Rehab Center - Downtown",
    clinicId: 1,
    patients: 42,
    status: "active",
    licenseNumber: "PT-12345",
    licenseExpiry: "2025-03-15",
    verificationStatus: "verified",
    joinDate: "2022-06-10",
    phone: "(212) 555-1234 ext. 101",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@kineticrehab.com",
    image: "/avatars/provider-2.jpg",
    specialty: "Orthopedic Rehabilitation",
    clinic: "Kinetic Physical Therapy - Westside",
    clinicId: 2,
    patients: 38,
    status: "active",
    licenseNumber: "PT-23456",
    licenseExpiry: "2024-11-22",
    verificationStatus: "verified",
    joinDate: "2022-08-15",
    phone: "(310) 555-6789 ext. 202",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@kineticrehab.com",
    image: "/avatars/provider-3.jpg",
    specialty: "Sports Rehabilitation",
    clinic: "Kinetic Movement Clinic - North",
    clinicId: 3,
    patients: 45,
    status: "active",
    licenseNumber: "PT-34567",
    licenseExpiry: "2025-01-30",
    verificationStatus: "verified",
    joinDate: "2022-05-20",
    phone: "(312) 555-9012 ext. 303",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "james.wilson@kineticrehab.com",
    image: "/avatars/provider-4.jpg",
    specialty: "Neurological Rehabilitation",
    clinic: "Kinetic Sports Rehab - Eastside",
    clinicId: 4,
    patients: 31,
    status: "inactive",
    licenseNumber: "PT-45678",
    licenseExpiry: "2024-08-12",
    verificationStatus: "verified",
    joinDate: "2023-01-15",
    phone: "(617) 555-3456 ext. 404",
  },
  {
    id: 5,
    name: "Dr. Olivia Kim",
    email: "olivia.kim@kineticrehab.com",
    image: "/avatars/provider-5.jpg",
    specialty: "Pediatric Physical Therapy",
    clinic: "Kinetic Recovery Center - South",
    clinicId: 5,
    patients: 28,
    status: "pending",
    licenseNumber: "PT-56789",
    licenseExpiry: "2025-05-08",
    verificationStatus: "pending",
    joinDate: "2023-04-02",
    phone: "(305) 555-7890 ext. 505",
  },
  {
    id: 6,
    name: "Dr. Robert Taylor",
    email: "robert.taylor@kineticrehab.com",
    image: "/avatars/provider-6.jpg",
    specialty: "Geriatric Rehabilitation",
    clinic: "Kinetic Rehab Center - Downtown",
    clinicId: 1,
    patients: 36,
    status: "pending",
    licenseNumber: "PT-67890",
    licenseExpiry: "2025-02-18",
    verificationStatus: "pending",
    joinDate: "2023-05-10",
    phone: "(212) 555-1234 ext. 606",
  },
];

// GET /api/providers - Mendapatkan semua provider
export async function GET(request: NextRequest) {
  // Mendapatkan parameter query untuk filtering
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const specialtyFilter = searchParams.get('specialty') || '';
  const clinicFilter = searchParams.get('clinic') || '';

  // Filter provider berdasarkan parameter
  let filteredProviders = [...providers];

  // Filter berdasarkan search query
  if (searchQuery) {
    filteredProviders = filteredProviders.filter(provider => 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.clinic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter berdasarkan status
  if (statusFilter !== 'all') {
    filteredProviders = filteredProviders.filter(provider => 
      provider.status === statusFilter
    );
  }

  // Filter berdasarkan specialty
  if (specialtyFilter) {
    filteredProviders = filteredProviders.filter(provider => 
      provider.specialty === specialtyFilter
    );
  }

  // Filter berdasarkan clinic
  if (clinicFilter) {
    filteredProviders = filteredProviders.filter(provider => 
      provider.clinic === clinicFilter
    );
  }

  return NextResponse.json(filteredProviders);
}

// POST /api/providers - Menambahkan provider baru
export async function POST(request: NextRequest) {
  try {
    const newProviderData = await request.json();

    // Validasi data yang diperlukan
    if (!newProviderData.name || !newProviderData.email || !newProviderData.specialty || !newProviderData.clinic) {
      return NextResponse.json(
        { error: 'Mohon isi semua kolom yang diperlukan' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah digunakan
    const emailExists = providers.some(provider => provider.email === newProviderData.email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh provider lain' },
        { status: 400 }
      );
    }

    // Generate ID baru
    const maxId = Math.max(...providers.map(p => p.id));
    const today = new Date();
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);

    // Buat provider baru dengan nilai default
    const newProvider = {
      ...newProviderData,
      id: maxId + 1,
      status: "pending",
      verificationStatus: "pending",
      image: "/placeholder-user.jpg",
      licenseExpiry: newProviderData.licenseExpiry || twoYearsFromNow.toISOString().split('T')[0],
      patients: 0,
      joinDate: today.toISOString().split('T')[0]
    };

    // Tambahkan ke array providers
    providers.push(newProvider);

    return NextResponse.json(newProvider, { status: 201 });
  } catch (error) {
    console.error('Error adding provider:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan provider' },
      { status: 500 }
    );
  }
}

// GET /api/providers/:id - Mendapatkan provider berdasarkan ID
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const provider = providers.find(p => p.id === id);

  if (!provider) {
    return NextResponse.json(
      { error: 'Provider tidak ditemukan' },
      { status: 404 }
    );
  }

  return NextResponse.json(provider);
}

// PUT /api/providers/:id - Mengupdate provider berdasarkan ID
export async function PUT(request: NextRequest) {
  try {
    const updatedProviderData = await request.json();
    const id = updatedProviderData.id;

    // Validasi data yang diperlukan
    if (!updatedProviderData.name || !updatedProviderData.email || !updatedProviderData.specialty || !updatedProviderData.clinic) {
      return NextResponse.json(
        { error: 'Mohon isi semua kolom yang diperlukan' },
        { status: 400 }
      );
    }

    // Cek apakah provider dengan ID tersebut ada
    const providerIndex = providers.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      return NextResponse.json(
        { error: 'Provider tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah email sudah digunakan oleh provider lain
    const emailExists = providers.some(p => p.email === updatedProviderData.email && p.id !== id);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh provider lain' },
        { status: 400 }
      );
    }

    // Update provider
    providers[providerIndex] = {
      ...providers[providerIndex],
      ...updatedProviderData
    };

    return NextResponse.json(providers[providerIndex]);
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate provider' },
      { status: 500 }
    );
  }
}

// DELETE /api/providers/:id - Menghapus provider berdasarkan ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');

    // Cek apakah provider dengan ID tersebut ada
    const providerIndex = providers.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      return NextResponse.json(
        { error: 'Provider tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus provider
    const deletedProvider = providers[providerIndex];
    providers = providers.filter(p => p.id !== id);

    return NextResponse.json({ message: 'Provider berhasil dihapus', provider: deletedProvider });
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus provider' },
      { status: 500 }
    );
  }
}

// PATCH /api/providers/:id/verify - Memverifikasi provider
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = parseInt(pathParts[pathParts.length - 2]);
    const action = pathParts[pathParts.length - 1];

    // Cek apakah provider dengan ID tersebut ada
    const providerIndex = providers.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      return NextResponse.json(
        { error: 'Provider tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verifikasi provider
    if (action === 'verify') {
      providers[providerIndex] = {
        ...providers[providerIndex],
        verificationStatus: 'verified',
        status: providers[providerIndex].status === 'pending' ? 'active' : providers[providerIndex].status
      };

      return NextResponse.json({
        message: 'Provider berhasil diverifikasi',
        provider: providers[providerIndex]
      });
    }

    return NextResponse.json(
      { error: 'Aksi tidak valid' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying provider:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memverifikasi provider' },
      { status: 500 }
    );
  }
}