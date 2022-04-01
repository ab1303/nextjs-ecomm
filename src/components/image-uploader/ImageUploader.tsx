import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Button from '../buttons/Button';

type UploaderProps = {
  uploadFinished: any;
  initialImage: string;
};

const ImageUploader = (props: UploaderProps) => {
  const fileSelect = useRef<HTMLInputElement>(null);
  const dropbox = useRef<HTMLHeadingElement>(null);

  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentDropbox = dropbox.current;

    function dragEnter(e: any) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragOver(e: any) {
      e.stopPropagation();
      e.preventDefault();
    }

    function drop(e: any) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = dt.files;

      handleFiles(files);
    }
    if (currentDropbox) {
      currentDropbox.addEventListener('dragenter', dragEnter, false);
      currentDropbox.addEventListener('dragover', dragOver, false);
      currentDropbox.addEventListener('drop', drop, false);
    }
    return () => {
      if (currentDropbox) {
        currentDropbox.removeEventListener('dragenter', dragEnter);
        currentDropbox.removeEventListener('dragover', dragOver);
        currentDropbox.removeEventListener('drop', drop);
      }
    };
  });
  useEffect(() => {
    setImage(
      props.initialImage && props.initialImage != '' ? props.initialImage : ''
    );
  }, [props.initialImage]);

  async function handleImageUpload() {
    if (fileSelect) {
      if (fileSelect.current) fileSelect.current.click();
    }
  }

  function handleFiles(files: any) {
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  }

  function uploadFile(file: any) {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', (e) => {
      setProgress(Math.round((e.loaded * 100.0) / e.total));
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);

        setImage(response.secure_url);
        props.uploadFinished(response.secure_url);
      }
    };
    if (process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET) {
      fd.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
      );
      fd.append('tags', 'browser_upload');
      fd.append('file', file);
      xhr.send(fd);
    }
  }
  const handleCancel = () => {
    setImage('');
    setProgress(0);
    props.uploadFinished('');
  };

  return (
    <div ref={dropbox}>
      {image != '' ? (
        <div>
          <Image
            className='object-contain rounded-lg w_full'
            src={image.replace('upload/', 'upload/w_600/')}
            height={400}
            width={600}
            alt='uploaded image'
          />
          <div>
            <Button onClick={handleCancel} variant='primary'>
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className='bg-gray-200 border-4 border-gray-400 border-dashed rounded-lg w_full h_1/2'
          style={{ height: 400 }}
        >
          <div className='flex items-center justify-center h-full'>
            {progress === 0 ? (
              <div className='text-center text-gray-700'>
                <button
                  className='block px-4 py-2 m-auto font-bold text-white bg-blue-600 rounded hover:bg-blue-800'
                  onClick={handleImageUpload}
                  type='button'
                >
                  Browse
                </button>
              </div>
            ) : (
              <span className='text-gray-700'>{progress}%</span>
            )}

            <input
              ref={fileSelect}
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
