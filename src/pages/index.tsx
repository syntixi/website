import React from 'react';
import classnames from 'classnames';
import ReactPlayer from 'react-player/youtube'
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
import CodeBlock from "@theme/CodeBlock";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

const installs = [
  {
    label: 'Curl',
    language: 'bash',
    children: `# Install
foo bar`
  },
  {
    label: 'Homebrew',
    language: 'bash',
    children: `# Install
foobar`
  },
  {
    label: 'Docker',
    language: 'bash',
    children: `# Pull
foobar`
  },
  {
    label: 'Asdf',
    language: 'bash',
    children: `foobar`
  },
]

const snippets = [
  {
    label: 'Mapping',
    further: '/',
    language: 'yaml',
    children: `foobar`,
  },
  {
    label: 'Multiplexing',
    further: '/',
    language: 'yaml',
    children: `foobar`,
  },
  {
    label: 'Windowing',
    further: '/',
    language: 'yaml',
    children: `foobar`,
  },
  {
    label: 'Enrichments',
    further: '/',
    language: 'yaml',
    children: `foobar`,
  },
];

const features = [
  {
    title: 'Title',
    imageUrl: '',
    description: (
      <>
        <p>
          Foo
        </p>
        <p>
          Bar
        </p>
      </>
    ),
  },
  {
    title: 'Video',
    imageUrl: '',
    description: (
      <>
        <p>Hello</p>
        <ReactPlayer
          className={classnames('col col-6 padding--lg')}
          url='https://youtu.be/Uf81zJkuYK0'
          controls={true}
        />
      </>
    ),
  },
];

interface FeatureArgs {
  imageUrl?: string;
  title?: string;
  description: JSX.Element;
};

function Feature({imageUrl, title, description}: FeatureArgs) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--6')}>
      {imgUrl && (
        <div className="text--center">
          <img className={classnames('padding-vert--md', styles.featureImage)} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      {description}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const siteConfig = context.siteConfig;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Fancy stream processing made operationally mundane">
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={classnames('col col--5 col--offset-1')}>
              <h1 className="hero__title">{siteConfig.title}</h1>
              <p className="hero__subtitle">{siteConfig.tagline}</p>
              <div className={styles.buttons}>
                <Link
                  className={classnames(
                    'button button--outline button--primary button--lg',
                    styles.getStarted,
                  )}
                  to={useBaseUrl('docs/')}>
                  Get Started
                </Link>
              </div>
            </div>
            <div className={classnames('col col--5')}>
              <img className={styles.heroImg} src="img/logo.svg" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="container">
          <div className="row">
            <div className={classnames(`${styles.pitch} col col--6`)}>
              <h2>It's boringly easy to use</h2>
              <p>
                Written in Go, deployed as a static binary, declarative configuration. <a href="https://github.com/syntixi/syntixi">Open source</a> and cloud native as utter heck.
              </p>
              {installs && installs.length && (
                <Tabs defaultValue={installs[0].label} values={installs.map((props, idx) => {
                  return {label:props.label, value:props.label};
                })}>
                  {installs.map((props, idx) => (
                    <TabItem key={idx} value={props.label}>
                      <CodeBlock {...props}/>
                    </TabItem>
                  ))}
                </Tabs>
              )}
            </div>
            <div className={classnames('col col--6')}>
                {snippets && snippets.length && (
                  <section className={styles.configSnippets}>
                    <Tabs defaultValue={snippets[0].label} values={snippets.map((props, idx) => {
                      return {label:props.label, value:props.label};
                    })}>
                      {snippets.map((props, idx) => (
                        <TabItem key={idx} value={props.label}>
                          <div style={{position: 'relative'}}>
                            <CodeBlock {...props}/>
                            {props.further && <Link
                              className={classnames(styles.furtherButton, 'button button--outline button--primary')}
                              to={props.further}>
                              Read about
                            </Link>}
                          </div>
                        </TabItem>
                      ))}
                    </Tabs>
                  </section>
                )}
            </div>
          </div>
        </div>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container margin-vert--md">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
