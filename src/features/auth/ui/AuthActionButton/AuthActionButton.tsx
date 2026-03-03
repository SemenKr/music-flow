import s from './AuthActionButton.module.css'

type Props = {
  label: string
  ariaLabel?: string
  variant?: 'login' | 'logout'
  onClick?: () => void
}

export const AuthActionButton = ({ label, ariaLabel, variant = 'login', onClick }: Props) => {
  return (
    <button
      type="button"
      className={s.button}
      data-variant={variant}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
    >
      <span className={s.icon} data-icon={variant} aria-hidden="true" />
      <span className={s.label}>{label}</span>
    </button>
  )
}
