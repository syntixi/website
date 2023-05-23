import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { DyteSpinner } from '@dytesdk/react-ui-kit';
import { useHistory } from '@docusaurus/router';
import clsx from 'clsx';

import useBreakpoint from '../lib/useBreakpoint';

function APIElement({ layout = 'sidebar', currentVersion = 'v1' }) {
  return (
    <BrowserOnly
      fallback={
        <div className="loading-container">
          <DyteSpinner />
        </div>
      }
    >
      {() => {
        // eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
        const { API } = require('@stoplight/elements');

        return (
          <div className={clsx('elements-container', layout)}>
            <API
              className="stacked"
              apiDescriptionUrl={`/api/${currentVersion}.yaml`}
              basePath="/"
              router="hash"
              layout={layout}
              hideSchemas
              hideInternal
            />
          </div>
        );
      }}
    </BrowserOnly>
  );
}

export default function Home() {
  const router = useHistory();
  const size = useBreakpoint();

  const location = router.location;

  const url = new URL(
    `https://docs.syntixi.dev/${location.pathname}${location.search}`
  );

  const currentVersion = url.searchParams.get('v') || 'v2';

  return (
    <Layout
      title="API Reference"
      description="Syntixi REST API Reference"
      noFooter
      wrapperClassName="api-reference"
    >
      <Head>
        {/* Load styles for Stoplight Elements */}
        <link rel="preload" href="/assets/css/elements.min.css" as="style" />
        <link rel="stylesheet" href="/assets/css/elements.min.css" />
      </Head>

      <APIElement
        layout={size === 'sm' ? 'stacked' : 'sidebar'}
        currentVersion={currentVersion}
      />
    </Layout>
  );
}
