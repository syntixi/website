---
title: Syntax Template
sidebar_label: Syntax Template
sidebar_position: 999
hide_title: false
tags:
- Tag1
- Tag2
draft: false
unlisted: true
---

## Display Highlight Badge

import Highlight from '@site/src/components/Highlight';

<div class="pill-list">
    <Highlight color="rgb(31 167 138)">Community</Highlight>
    <Highlight color="rgb(238 67 110)">Enterprise</Highlight>
</div>

## Code

* Block

```bash
This is a code block.
```

* Inline

This is an `inline` sample. This is an bold **`inline`** sample.


## Display Image

* Default layout

![](/img/logo.svg)

* Custom layout

<div style={{textAlign: 'center'}}><img src="/img/logo.svg" /></div>

## Button

<Link to="/docs/template" className="button button--lg button--outline button--block button--primary">Get Started</Link>

## Tabs

import Tabs from '@theme/Tabs';

<Tabs defaultValue="stdoutlogfmt" values={[
{ label: 'Logfmt to Stdout', value: 'stdoutlogfmt', },
{ label: 'JSON to File', value: 'filejson', },
]}>

import TabItem from '@theme/TabItem';

<TabItem value="stdoutlogfmt">

```yaml
logger:
  level: INFO
  format: logfmt
  add_timestamp: false
  static_fields:
    '@service': benthos
```

</TabItem>
<TabItem value="filejson">

```yaml
logger:
  level: WARN
  format: json
  file:
    path: ./logs/benthos.ndjson
    rotate: true
```

</TabItem>

</Tabs>

## Admonition

:::warning Message Title
warning
:::

:::info Message Title
info
:::

:::note Message Title
info
:::

:::caution Message Title
info
:::

## `Quote TOC`

## Table

| Option | Summary |
|---|---|
|hello|world|

## Asciinema

import AsciinemaWidget from '@site/src/components/AsciinemaWidget';

<div className='container margin-vert--lg'>
  <div className='row row--no-gutters'>
    <AsciinemaWidget src="https://asciinema.org/a/427282.cast" rows={30} idleTimeLimit={3} preload={true} />
  </div>
</div>

## Video

import ReactPlayer from 'react-player/youtube';

<div className='container margin-vert--lg'>
  <div className='row row--no-gutters'>
    <ReactPlayer
        className='col'
        height='500px'
        url='https://www.youtube.com/watch?v=Uf81zJkuYK0'
        controls={true}
    />
  </div>
</div>