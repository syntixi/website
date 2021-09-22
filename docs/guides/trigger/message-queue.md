---
title: Message Queue Trigger
sidebar_label: 'Message Queue'
sidebar_position: 2
---

Message Queue Trigger invokes a function when receiving message from subscribed topic.

## How to create a message queue trigger

You will need to provide three topics (subject) when creating a trigger.

* **Topic** (required)
    * Syntixi subscribes to this topic and invokes a function when receiving message from it.
* **Response topic** (optional)
    * If an invocation is success and the status code of function response is **200**, response body will be sent to this topic.
* **Error topic** (optional)
    * If any error occurs during invocation or the status code of function response is not equal to **200**, error will be sent to this topic.
    * It's recommend to monitor whether error topic receives any unwanted error, it helps us to handle the error as soon as possible.
    * If no error topic is provided, all error messages will be discarded and may increase complextility when toudbleshooting.

```sh
$ syntixi mqt create --name hello --function hello \
    --topic hw --resptopic 'hw-response' --errtopic 'hw-error'
```

### Content Type

The default content type of requests sent by Syntixi is `application/json`. To change it, you can use `--contenttype` to specify the type when creating/updating the trigger.

For example, if a function can only accepts request in YAML format. We can update the content type of existing trigger to `text/yaml`.

```sh
$ syntixi mqt update --name hello --contenttype 'text/yaml'
```