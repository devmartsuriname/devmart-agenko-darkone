/**
 * Project Gallery Upload Component
 * Multi-image upload to Supabase Storage 'media' bucket
 * 
 * Features:
 * - Upload multiple images at once
 * - Drag & drop support
 * - Grid preview of uploaded images
 * - Remove individual images from gallery
 */
import { useState, useRef } from 'react'
import { Button, Spinner, Card, Row, Col } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

interface ProjectGalleryUploadProps {
  value: string[] | null
  onChange: (urls: string[] | null) => void
  maxImages?: number
}

export const ProjectGalleryUpload = ({ 
  value, 
  onChange, 
  maxImages = 10 
}: ProjectGalleryUploadProps) => {
  const { showNotification } = useNotificationContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const images = value || []

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    // Check max images limit
    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      showNotification({
        message: `Maximum ${maxImages} images allowed`,
        variant: 'warning',
      })
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    
    // Filter and validate files
    const validFiles = filesToUpload.filter(file => {
      if (!validTypes.includes(file.type)) {
        showNotification({
          message: `${file.name}: Invalid file type`,
          variant: 'warning',
        })
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification({
          message: `${file.name}: File too large (max 5MB)`,
          variant: 'warning',
        })
        return false
      }
      return true
    })

    if (!validFiles.length) return

    try {
      setUploading(true)
      const uploadedUrls: string[] = []

      for (const file of validFiles) {
        const timestamp = Date.now()
        const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase()
        const filePath = `projects/gallery/${timestamp}-${sanitizedName}`

        const { data, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(data.path)

        uploadedUrls.push(publicUrlData.publicUrl)
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls])
        showNotification({
          message: `${uploadedUrls.length} image(s) uploaded successfully`,
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('Error uploading gallery images:', err)
      showNotification({
        message: 'Failed to upload some images',
        variant: 'danger',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleUpload(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files) {
      handleUpload(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages.length > 0 ? newImages : null)
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="d-none"
        multiple
      />

      {/* Gallery Grid */}
      {images.length > 0 && (
        <Row className="g-2 mb-3">
          {images.map((url, index) => (
            <Col key={index} xs={4} md={3}>
              <Card className="border h-100">
                <Card.Body className="p-1">
                  <div className="position-relative">
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ 
                        height: '80px', 
                        width: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 p-0 m-1"
                      style={{ width: '20px', height: '20px', lineHeight: '1' }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Icon icon="mingcute:close-line" style={{ fontSize: '12px' }} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
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
              <Icon icon="mingcute:gallery-line" className="fs-4 text-muted mb-1" />
              <p className="mb-1 small">
                <span className="text-primary">Add gallery images</span>
              </p>
              <small className="text-muted">
                {images.length}/{maxImages} images
              </small>
            </>
          )}
        </div>
      )}
    </div>
  )
}
