import styles from './DetailPanel.module.css'

export interface DetailRow {
  label: string
  value?: string | null
}

interface DetailPanelProps {
  title: string
  rows: DetailRow[]
  showHeading?: boolean
  heading?: string | null
}

function DetailPanel({ title, rows, showHeading, heading }: DetailPanelProps) {
  return (
    <div className={styles.panel}>
      <h3 className={styles.label}>{title}</h3>

      <div className={styles.body}>
        {showHeading && <p className={styles.heading}>{heading}</p>}

        <table className={styles.table}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DetailPanel
