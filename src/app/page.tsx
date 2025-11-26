'use client'

import { parseGameLog } from "./libs/tsvparser";
import styles from "./page.module.css";

export default function Home() {

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log("Uploaded:", file);

    processGamelog(file);
  }

  async function processGamelog(file: File) {
    console.log("Processing file:", file);
    parseGameLog(file).then(value => {

    })
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <label>Upload Gamelog TSV file</label>

        <input type="file"  
          onChange={handleFileUpload}
        />

      </main>
    </div>
  );
}
