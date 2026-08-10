import styles from './DetailPanel.module.css'

interface DetailPanelProps {
  title: string
  rows: string[]
  showHeading?: boolean
}

function DetailPanel({ title, rows, showHeading }: DetailPanelProps) {
  return (
    <div className={styles.panel}>
      <h3 className={styles.label}>{title}</h3>

      <div className={styles.body}>
        {showHeading && <p className={styles.heading}></p>}

        <table className={styles.table}>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <th scope="row">{row}</th>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DetailPanel
