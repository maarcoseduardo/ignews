import Head from 'next/head';

import React from 'react';
import styles from './home.module.scss'

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for $9.99</span>
        </p>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </React.Fragment>
  )
}
