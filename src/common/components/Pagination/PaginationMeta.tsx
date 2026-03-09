import s from './PaginationMeta.module.css'

const PAGE_SIZE_OPTIONS = [4, 6, 8, 12, 20]

type Props = {
  pageSize: number
  onPageSizeChange: (size: number) => void
}

export const PaginationMeta = ({ pageSize, onPageSizeChange }: Props) => {
  return (
    <div className={s.paginationMeta}>
      <label className={s.pageSizeLabel}>
        Show
        <select
          className={s.pageSizeSelect}
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
        per page
      </label>
    </div>
  )
}
