'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  maxSizeMB?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  bucket = 'product-images',
  maxSizeMB = 5,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85,
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const compressImage = useCallback(
    (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(objectUrl)

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          canvas.width = width
          canvas.height = height

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to compress image'))
              }
            },
            'image/webp',
            quality
          )
        }

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('Failed to load image'))
        }

        img.src = objectUrl
      })
    },
    [maxWidth, maxHeight, quality]
  )

  const uploadToSupabase = useCallback(
    async (file: Blob, fileName: string): Promise<string> => {
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/webp',
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
      return publicUrlData.publicUrl
    },
    [bucket, supabase]
  )

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!file.type.startsWith('image/')) {
        setError('Le fichier doit être une image')
        return
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`L'image ne doit pas dépasser ${maxSizeMB} MB`)
        return
      }

      setUploading(true)

      try {
        const compressedBlob = await compressImage(file)

        const timestamp = Date.now()
        const ext = 'webp'
        const fileName = `${timestamp}-${Math.random().toString(36).slice(2, 9)}.${ext}`

        const publicUrl = await uploadToSupabase(compressedBlob, fileName)

        setPreview(publicUrl)
        onChange(publicUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du téléversement')
      } finally {
        setUploading(false)
      }
    },
    [compressImage, uploadToSupabase, maxSizeMB, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
      if (e.target) {
        e.target.value = ''
      }
    },
    [handleFile]
  )

  const removeImage = useCallback(() => {
    setPreview(null)
    onChange('')
    setError(null)
  }, [onChange])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/30',
          uploading && 'opacity-50 pointer-events-none'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
        aria-label="Zone de téléversement d'image"
      >
        {preview ? (
          <div className="relative max-w-xs mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeImage()
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
              aria-label="Supprimer l'image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Image prête</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {dragActive ? 'Déposez l\'image ici' : 'Cliquez ou déposez une image'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP, GIF • Max {maxSizeMB} MB • Redimensionné à {maxWidth}×{maxHeight}px max
            </p>
            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/50" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center gap-3 shadow-xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm font-medium">Téléversement...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {preview && (
        <input
          type="hidden"
          name="image_url"
          value={preview}
        />
      )}
    </div>
  )
}