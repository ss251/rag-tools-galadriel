"use client"
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { CopyIcon, TickIcon } from '@/components/ui/icons';

export default function KnowledgeBaseGeneration() {
  const [files, setFiles] = useState<File[]>([]);
  const [chunkSize, setChunkSize] = useState(1500);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [response, setResponse] = useState<null | { cid: string; index_cid: string; 'number of documents': string; [key: string]: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState({ cid: false, index_cid: false, 'number of documents': false });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (files.length === 0) {
      setError('Please select at least one file to upload');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      console.log(`Adding file ${index}:`, file.name, file.type, file.size);
      formData.append('file', file);
    });
    formData.append('chunk_size', chunkSize.toString());
    formData.append('chunk_overlap', chunkOverlap.toString());

    try {
      console.log('Sending request to /api/process-rag');
      const res = await fetch('/api/process-rag', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        setResponse(data);
        setError(null);
      } else {
        setResponse(null);
        setError(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setResponse(null);
      setError('An error occurred while processing the files.');
    } finally {
      setLoading(false);
    }
  };


  const handleCopy = (key: string) => {
    if (response && response[key]) {
      navigator.clipboard.writeText(response[key])
        .then(() => setCopySuccess((prevState) => ({ ...prevState, [key]: true })))
        .catch(() => setCopySuccess((prevState) => ({ ...prevState, [key]: false })));
      setTimeout(() => setCopySuccess((prevState) => ({ ...prevState, [key]: false })), 2000);
    }
  };

  return (
    <section className="mx-auto space-y-6 mt-6 mb-24">
      <div className=" max-w-lg md:max-w-2xl px-4 md:px-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Generate Your Knowledge Base</h2>
            <p className="text-muted-foreground md:text-xl">Upload and configure your documents for RAG.</p>
          </div>
          <Card>
            <CardContent className="space-y-4 mt-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4">
                  <Label htmlFor="file-upload">Files</Label>
                  <Input type="file" id="file-upload" onChange={handleFileChange} multiple />
                </div>
                <div className="grid gap-4 mb-6">
                  <Label htmlFor="chunk-size">Chunk Size</Label>
                  <Slider
                    id="chunk-size"
                    max={3000}
                    step={100}
                    value={[chunkSize]}
                    onValueChange={(value) => setChunkSize(value[0])}
                  />
                  <div>Value: {chunkSize}</div>
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
                  <Slider
                    id="chunk-overlap"
                    max={1000}
                    step={50}
                    value={[chunkOverlap]}
                    onValueChange={(value) => setChunkOverlap(value[0])}
                  />
                  <div>Value: {chunkOverlap}</div>
                </div>
                <CardFooter className="flex justify-between mt-4">
                  {!loading && <Button type="submit" className="mr-auto">Upload</Button>}
                  {loading && (
                    <div className="flex justify-center mt-2">
                      <Spinner size="medium" />
                      <span className='mt-1 ml-2'>Processing</span>
                    </div>
                  )}
                </CardFooter>
              </form>
              {response && !loading && (
                <>
                  <div className='mt-4'><Label className="text-lg">CID</Label></div>
                  <Alert variant="default" className="mt-2 relative">
                    <AlertDescription>
                      <pre className="whitespace-pre-wrap">{response.cid.slice(0, 20)}...{response.cid.slice(-10)}</pre>
                    </AlertDescription>
                    <div className="absolute top-3 right-4">
                      {copySuccess.cid ? <TickIcon className="text-green-500" /> : <CopyIcon onClick={() => handleCopy('cid')} className="cursor-pointer" />}
                    </div>
                  </Alert>
                  <div className='mt-4'><Label className="text-lg">Index CID</Label></div>
                  <Alert variant="default" className="mt-2 relative">
                    <AlertDescription>
                      <pre className="whitespace-pre-wrap">{response.index_cid.slice(0, 20)}...{response.index_cid.slice(-10)}</pre>
                    </AlertDescription>
                    <div className="absolute top-3 right-4">
                      {copySuccess.index_cid ? <TickIcon className="text-green-500" /> : <CopyIcon onClick={() => handleCopy('index_cid')} className="cursor-pointer" />}
                    </div>
                  </Alert>
                  <div className='mt-4'><Label className="text-lg">Number of Documents</Label></div>
                  <Alert variant="default" className="mt-2 relative">
                    <AlertDescription>
                      <pre className="whitespace-pre-wrap">{response['number of documents']}</pre>
                    </AlertDescription>
                    <div className="absolute top-3 right-4">
                      {copySuccess['number of documents'] ? <TickIcon className="text-green-500" /> : <CopyIcon onClick={() => handleCopy('number of documents')} className="cursor-pointer" />}
                    </div>
                  </Alert>
                </>
              )}
              {error && !loading && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
