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

export function formatCurrency(amount: number) {
  return `$ ${(Math.round(amount * 100) / 100).toFixed(2)} USD`
}
