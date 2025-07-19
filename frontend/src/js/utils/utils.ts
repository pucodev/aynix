import Swal from 'sweetalert2'

interface ShowErrorOptions {
  title?: string
}

export function showError(message: string, options: ShowErrorOptions = {}) {
  const { title = 'Ops!' } = options
  Swal.fire({
    title,
    text: message,
    icon: 'error',
  })
}
