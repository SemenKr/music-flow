import {type ChangeEvent, useId} from 'react'
import s from './PlaylistSearch.module.css'

type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    resultsCount?: number
    totalCount?: number
    isLoading?: boolean
}

export const PlaylistSearch = ({
    value,
    onChange,
    placeholder = 'Search playlist by title',
    resultsCount,
    totalCount,
    isLoading
}: Props) => {
    const inputId = useId()

    const hasValue = value.trim().length > 0
    const resolvedResults = resultsCount ?? 0
    const resolvedTotal = totalCount ?? resolvedResults

    const metaText = isLoading
        ? 'Searching...'
        : hasValue
            ? `${resolvedResults} of ${resolvedTotal} shown`
            : `${resolvedTotal} playlists`

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value)
    }

    const clearSearch = () => {
        onChange('')
    }

    return (
        <section className={s.card} aria-label="Playlist search">
            <div className={s.header}>
                <label className={s.label} htmlFor={inputId}>Search</label>
                <span className={s.meta} aria-live="polite">{metaText}</span>
            </div>
            <div className={s.field}>
                <span className={s.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                        <path
                            d="M11 4a7 7 0 0 1 5.6 11.2l3.6 3.6a1 1 0 0 1-1.4 1.4l-3.6-3.6A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
                            fill="currentColor"
                        />
                    </svg>
                </span>
                <input
                    id={inputId}
                    type="search"
                    className={s.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={onInputChange}
                />
                {hasValue && (
                    <button
                        className={s.clear}
                        type="button"
                        onClick={clearSearch}
                        aria-label="Clear search"
                    >
                        Clear
                    </button>
                )}
            </div>
            <p className={s.hint}>Type a title to filter your playlists in real time.</p>
        </section>
    )
}
