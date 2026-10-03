import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = path.extname(file.name) || '.png';
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const filename = `${cleanBase}_${uniqueSuffix}${ext}`;

    let publicUrl = '';
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      console.warn('Filesystem write not available (serverless read-only), falling back to Data URL:', fsErr);
      const mimeType = file.type || 'image/png';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
