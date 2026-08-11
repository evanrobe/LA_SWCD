// Reusable labeled-rows panel used for each of Attributes/Species/Homeworld in CharacterDetail.
import styles from './DetailPanel.module.css'

/** A single label/value row within a DetailPanel. */
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

/** A titled box with an optional heading line and a table of label/value rows. */
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
