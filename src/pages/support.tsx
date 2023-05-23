import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import classnames from 'classnames';
import styles from './support.module.css';
import useBaseUrl from "@docusaurus/useBaseUrl";

function Support() {
  return (
    <Layout title="Support" description="How to get Syntixi support">
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={classnames('col col--5 col--offset-1')}>
              <h1 className="hero__title">Syntixi Support</h1>
              <p className="hero__subtitle">Explore our variety of support options, including Slack and community resources.</p>
              <div className={styles.buttons}>
                  <Link
                    className={classnames(
                 'button button--outline button--primary button--lg',
                       styles.getStarted,
                    )}
                    to={useBaseUrl('docs/')}>
                    Join us on Slack
                  </Link>
              </div>
            </div>
            <div className={classnames('col col--5')}>
              <img className={styles.heroImg} src="/img/logo.svg" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <br/>
        <section>
          <div className="container container-narrow padding-bottom--lg">
            <div className="row margin-bottom--lg">
              <div className="col col--12">
                <h2 id="community-support">Community Support
                  <a className="hash-link" href="#community-support" title="Direct link to heading">​</a></h2>
                <p>foobar</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Support;