import Loader from './Loader'

interface AlertLoaderProps {
  message?: string
}

export default function AlertLoader({ message }: AlertLoaderProps) {
  return (
    <div className="dialog is-active">
      <div className="dialog-bg"></div>
      <div className="dialog-card" style={{ maxWidth: '400px' }}>
        <section className="dialog-body">
          <Loader />
          <div
            className="is-text-center is-font-bold pb-3 mx-auto"
            style={{ maxWidth: '320px' }}
          >
            {message || 'Loading'}
          </div>
        </section>
      </div>
    </div>
  )
}
