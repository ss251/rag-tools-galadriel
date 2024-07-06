import { writeFile, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to a temporary directory
    const path = `/tmp/${file.name}`;
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Call your Python API with the saved file path
    try {
      const formData = new FormData();
      formData.append('file', new Blob([buffer]), file.name);
      formData.append('chunk_size', data.get('chunk_size') as string);
      formData.append('chunk_overlap', data.get('chunk_overlap') as string);

      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

      if (!apiEndpoint) {
        throw new Error('API endpoint is not defined');
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Convert both cid and index_cid from CIDv0 to CIDv1
        const cidV0 = result.cid as string | undefined;
        const indexCidV0 = result.index_cid as string | undefined;
        
        const cid_v1 = cidV0 ? CID.parse(cidV0).toV1().toString(base32) : null;
        const index_cid_v1 = indexCidV0 ? CID.parse(indexCidV0).toV1().toString(base32) : null;

        // Return the response with both original and converted CIDs
        return NextResponse.json({
          ...result,
          cid_v1,
          index_cid_v1
        }, { status: 200 });
      } else {
        return NextResponse.json(result, { status: response.status });
      }
    } catch (error) {
      console.error('Error processing the file with Python API:', error);
      return NextResponse.json({ error: 'Error processing the file with Python API' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error handling the file upload:', error);
    return NextResponse.json({ error: 'Error handling the file upload' }, { status: 500 });
  }
}