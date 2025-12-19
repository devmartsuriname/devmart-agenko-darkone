/**
 * Home About Image Upload Component
 * Handles about section image uploads to Supabase Storage (media/home-about/)
 */
import { useState, useCallback } from 'react'
import { Button, Spinner, Image } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

interface HomeAboutImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export const HomeAboutImageUpload = ({ value, onChange, label = 'About Image' }: HomeAboutImageUploadProps) => {
  const { showNotification } = useNotificationContext()
  const [uploading, setUploading] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploading(true)

      // Generate unique filename
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `home-about/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      onChange(publicUrl)
      showNotification({ message: 'Image uploaded successfully', variant: 'success' })
    } catch (err) {
      console.error('Upload error:', err)
      showNotification({ message: 'Failed to upload image', variant: 'danger' })
    } finally {
      setUploading(false)
    }
  }, [onChange, showNotification])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0])
    }
  }, [uploadFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div>
      {value ? (
        <div className="position-relative d-inline-block">
          <Image
            src={value}
            alt={label}
            rounded
            style={{ maxWidth: '300px', maxHeight: '180px', objectFit: 'cover' }}
          />
          <div className="mt-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Icon icon="mingcute:refresh-2-line" className="me-1" />
              Replace
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemove}
            >
              <Icon icon="mingcute:close-line" className="me-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border border-2 border-dashed rounded p-4 text-center cursor-pointer ${
            isDragActive ? 'border-primary bg-light' : 'border-secondary'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Spinner animation="border" size="sm" className="mb-2" />
              <p className="mb-0 text-muted">Uploading...</p>
            </>
          ) : (
            <>
              <Icon icon="mingcute:image-line" className="fs-1 text-muted mb-2 d-block" />
              <p className="mb-0 text-muted">
                {isDragActive
                  ? 'Drop the image here...'
                  : 'Drag & drop an image, or click to select'}
              </p>
              <small className="text-muted">PNG, JPG, GIF, WebP up to 10MB</small>
            </>
          )}
        </div>
      )}
    </div>
  )
}
