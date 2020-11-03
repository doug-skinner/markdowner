# Markdowner

A simple command line tool that allows you to download a website as markdown.

## Quick Start

Getting up and running with this tool is very easy. To install the tool and us it to download a specific website and print it out to the console, you can run the following:

```bash
npm i -g markdowner
markdowner -u https://google.com
```

## API Documentation

### Commandline flags

The following are a list of all flags that can or must be passed into the application.

| Long Flag   | Short Flag | Mandatory | Description                                                                                                          |
|-------------|------------|-----------|----------------------------------------------------------------------------------------------------------------------|
| --url <url> | -u <url>   | Yes       | The url of the website that should be converted into markdown.                                                       |
| --debug     | -d         | No        | Used if you want the application to print extra information. This shouldn't need to be used in normal circumstances. |
| --clipboard | -c         | No        | Passes the markdown from the downloaded website into the system clipboard rather than standard out.                  |

## How to contribute

There are many ways that this repository can be contributed to! The easiest way is to [submit issues](https://github.com/doug-skinner/markdowner/issues) to this repository noting bugs that it may have.

Another way to help work on this repository is to comment on one of the already existing issues and start working on it. If there's something that sounds good to be implemented, but there just hasn't been time for me to do it yet, feel free to start working on it. I would just ask that you tag me in a comment first, to make sure those no duplication of effort going on.
