/**
 * Blog Post Image Upload Component
 * Uploads to Supabase Storage 'media' bucket
 * 
 * Features:
 * - File upload with drag & drop
 * - Preview thumbnail
 * - Replace image
 * - Clear image (removes from field only, NOT from storage per spec)
 */
import { useState, useRef } from 'react'
import { Button, Spinner, Card } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

interface BlogPostImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export const BlogPostImageUpload = ({ value, onChange, label = 'Image' }: BlogPostImageUploadProps) => {
  const { showNotification } = useNotificationContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      showNotification({
        message: 'Invalid file type. Please upload JPG, PNG, WebP, or GIF.',
        variant: 'danger',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification({
        message: 'File too large. Maximum size is 5MB.',
        variant: 'danger',
      })
      return
    }

    try {
      setUploading(true)

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase()
      const filePath = `blog/${timestamp}-${sanitizedName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path)

      onChange(publicUrlData.publicUrl)
      showNotification({
        message: `${label} uploaded successfully`,
        variant: 'success',
      })
    } catch (err) {
      console.error('Error uploading image:', err)
      showNotification({
        message: `Failed to upload ${label.toLowerCase()}`,
        variant: 'danger',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleClear = () => {
    onChange(null)
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="d-none"
      />

      {value ? (
        <Card className="border">
          <Card.Body className="p-2">
            <div className="position-relative">
              <img
                src={value}
                alt={`${label} preview`}
                className="img-fluid rounded"
                style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
              />
              {uploading && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <Spinner animation="border" variant="light" />
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleReplace}
                disabled={uploading}
                className="flex-grow-1"
              >
                <Icon icon="mingcute:refresh-1-line" className="me-1" />
                Replace
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleClear}
                disabled={uploading}
              >
                <Icon icon="mingcute:close-line" />
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div
          className={`border rounded p-3 text-center cursor-pointer ${
            dragOver ? 'border-primary bg-light' : 'border-dashed'
          }`}
          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div>
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="mb-0 mt-2 text-muted small">Uploading...</p>
            </div>
          ) : (
            <>
              <Icon icon="mingcute:upload-2-line" className="fs-4 text-muted mb-1" />
              <p className="mb-1 small">
                <span className="text-primary">Click to upload</span>
              </p>
              <small className="text-muted">Max 5MB</small>
            </>
          )}
        </div>
      )}
    </div>
  )
}
