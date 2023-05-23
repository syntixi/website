---
sidebar_label: 'Cron'
sidebar_position: 3
---

# Cron trigger

import Highlight from '@site/src/components/Highlight';

<div class="pill-list">
    <Highlight color="rgb(31 167 138)">Community</Highlight>
    <Highlight color="rgb(238 67 110)">Enterprise</Highlight>
</div>

## Introduction

Cron trigger invokes a function periodically based on provided crontab specification.

## How to create a cron trigger

Assume we want to trigger a function every minutes, you can provide `* * * * *` as crontab specification when create the cron trigger. (Visit [here](https://en.wikipedia.org/wiki/Cron) here to learn more about crontab specification.)

```sh
$ syntixi crontrigger create --name hello --function hello --cron "* * * * *"
```

### Suspend a cron trigger

To suspend a cron trigger you will need to set `--suspend` when creating or updating the trigger. Let's suspend the trigger we created in the  last step.

```sh
$ syntixi crontrigger update --name hello --suspend
```

To unsuspend the trigger, you can set `--suspend` to `false`.

```sh
$ syntixi crontrigger update --name hello --suspend=false
```