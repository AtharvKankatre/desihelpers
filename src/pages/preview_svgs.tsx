import React from 'react';
import fs from 'fs';
import path from 'path';

export async function getServerSideProps() {
  const dirPath = path.join(process.cwd(), 'public', 'newillustration');
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.svg'));
  return {
    props: {
      files,
    },
  };
}

export default function PreviewSvgs({ files }: { files: string[] }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>SVG Previews</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {files.map(file => (
          <div key={file} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <img src={`/newillustration/${file}`} alt={file} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
            <p style={{ fontSize: '12px', maxWidth: '150px', wordWrap: 'break-word' }}>{file}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
