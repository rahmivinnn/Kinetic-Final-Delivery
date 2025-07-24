import { NextRequest, NextResponse } from 'next/server';

// Mengimpor data provider dari file route.ts di direktori parent
import { providers } from '../route';

// GET /api/providers/:id - Mendapatkan provider berdasarkan ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const updatedProviderData = await request.json();

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
      ...updatedProviderData,
      id // Pastikan ID tidak berubah
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

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
    providers.splice(providerIndex, 1);

    return NextResponse.json({ message: 'Provider berhasil dihapus', provider: deletedProvider });
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus provider' },
      { status: 500 }
    );
  }
}