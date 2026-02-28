import s from './LinearProgress.module.css'

type Props = {
    height?: number
    className?: string
}

export const LinearProgress = ({ height = 4, className }: Props) => {
    const rootClassName = className ? `${s.root} ${className}` : s.root

    return (
        <div className={rootClassName} style={{ height }}>
            <div className={`${s.bar} ${s.indeterminate1}`} />
            <div className={`${s.bar} ${s.indeterminate2}`} />
        </div>
    )
}
