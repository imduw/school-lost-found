import { useCallback, useId, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

function useModalDialogSync(open, dialogRef, onClose) {
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, dialogRef])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    let pressedOutside = false
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }

    const onDown = (e) => {
      pressedOutside = isOutside(e)
    }
    const onUp = (e) => {
      if (pressedOutside && isOutside(e)) {
        onCloseRef.current?.()
      }
      pressedOutside = false
    }

    dialog.addEventListener('pointerdown', onDown)
    dialog.addEventListener('pointerup', onUp)
    return () => {
      dialog.removeEventListener('pointerdown', onDown)
      dialog.removeEventListener('pointerup', onUp)
    }
  }, [dialogRef])
}

export function ReasonDialog({
  open,
  title,
  description,
  fieldLabel = 'Lý do thực hiện',
  confirmLabel = 'Xác nhận',
  danger = true,
  initialValue = '',
  submitting = false,
  onClose,
  onConfirm,
}) {
  const titleId = useId()
  const fieldId = useId()
  const dialogRef = useRef(null)
  const [reason, setReason] = useState(initialValue)
  const [localError, setLocalError] = useState('')

  const handleClose = useCallback(() => {
    if (submitting) return
    setReason(initialValue)
    setLocalError('')
    onClose()
  }, [submitting, initialValue, onClose])

  useModalDialogSync(open, dialogRef, handleClose)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) {
      setLocalError('Vui lòng nhập lý do trước khi xác nhận')
      return
    }
    setLocalError('')
    await onConfirm(trimmed)
    setReason(initialValue)
  }

  return (
    <dialog
      ref={dialogRef}
      className="slf-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
    >
      <div className="slf-dialog-inner">
        <div className="slf-dialog-header">
          <h2 id={titleId} className="slf-dialog-title">
            {title}
          </h2>
          <button
            type="button"
            className="slf-dialog-close"
            onClick={handleClose}
            aria-label="Đóng hộp thoại"
          >
            <X size={16} />
          </button>
        </div>

        {description && <p style={{ fontSize: 13, color: '#67786F' }}>{description}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="slf-dialog-field">
            <label htmlFor={fieldId} className="slf-dialog-label">
              {fieldLabel} <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              id={fieldId}
              className="slf-dialog-textarea"
              required
              autoFocus
              maxLength={300}
              value={reason}
              aria-invalid={localError ? 'true' : undefined}
              onChange={(e) => {
                setReason(e.target.value)
                if (localError && e.target.value.trim()) setLocalError('')
              }}
            />
            {localError && (
              <span role="alert" style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
                {localError}
              </span>
            )}
          </div>

          <div className="slf-dialog-actions">
            <button type="button" className="slf-btn-secondary" disabled={submitting} onClick={handleClose}>
              Hủy
            </button>
            <button
              type="submit"
              className={danger ? 'slf-btn-danger' : 'slf-btn-primary'}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  danger = false,
  submitting = false,
  onClose,
  onConfirm,
}) {
  const titleId = useId()
  const dialogRef = useRef(null)

  const handleClose = useCallback(() => {
    if (!submitting) onClose()
  }, [submitting, onClose])

  useModalDialogSync(open, dialogRef, handleClose)

  return (
    <dialog
      ref={dialogRef}
      className="slf-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
    >
      <div className="slf-dialog-inner">
        <div className="slf-dialog-header">
          <h2 id={titleId} className="slf-dialog-title">
            {title}
          </h2>
          <button
            type="button"
            className="slf-dialog-close"
            onClick={handleClose}
            aria-label="Đóng hộp thoại"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 14, color: '#34443B', lineHeight: 1.5 }}>{message}</p>

        <div className="slf-dialog-actions">
          <button
            type="button"
            className="slf-btn-secondary"
            autoFocus
            disabled={submitting}
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className={danger ? 'slf-btn-danger' : 'slf-btn-primary'}
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export function ImageLightboxDialog({ imageUrl, title = 'Ảnh minh chứng đối chiếu', onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const open = Boolean(imageUrl)

  useModalDialogSync(open, dialogRef, onClose)

  return (
    <dialog
      ref={dialogRef}
      className="slf-dialog slf-dialog-lightbox"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className="slf-dialog-inner">
        <div className="slf-dialog-header">
          <h2 id={titleId} className="slf-dialog-title">
            {title}
          </h2>
          <button
            type="button"
            className="slf-dialog-close"
            onClick={onClose}
            aria-label="Đóng ảnh"
          >
            <X size={16} />
          </button>
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '72vh',
              objectFit: 'contain',
              borderRadius: 10,
              background: '#F8FAFC',
            }}
          />
        )}
      </div>
    </dialog>
  )
}
