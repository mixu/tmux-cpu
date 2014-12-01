# tmux-cpu

Display CPU usage in your tmux status bar or in the terminal.

## Installation

Install Node, then use npm:

    sudo npm install -g tmux-cpu

## Example

Here's how my tmux status bar looks like. This uses both [`tmux-cpu`](https://github.com/mixu/tmux-cpu) and [`tmux-mem`](https://github.com/mixu/tmux-mem): 

![Example](https://raw.githubusercontent.com/mixu/tmux-cpu/master/tmux.png)

And here is the line in `~/.tmux.conf` that invokes both commands and displays the result:

```
set-option -g status-right '#(/usr/local/bin/tmux-mem --format ":currentBytes [#[fg=:color]:spark#[default]] #[fg=:color]:percent#[default]") #(/usr/local/bin/tmux-cpu --format ":load [#[fg=:color]:spark#[default]] #[fg=:color]:percent#[default]") %H:%M %d-%b-%y'
```

You'll need to install both `tmux-cpu` and `tmux-mem` with `npm install -g` for this to work.

## Usage

Usage: `tmux-cpu`

## Options:

    --ascii         Display ASCII percentage bar ([======   ] instead of [▆])
    --width <int>   The width of the ASCII bar, default: 10.
    --format <str>  Use a custom formatting string.
    --no-color      Disable colors.
    --help          Show help.
    --version       Show version.

## Custom formatting:

The default formatting string is
`#[fg=:color][:spark] :load :percent #[default][:spark5] :load5 :percent5 #[fg=black,bold][:spark15] :load15 :percent15`.

You can use these tokens in the custom formatting string:

- `:load`: Load average for the past minute.
- `:load5`: Load average for the past 5 minutes.
- `:load15`: Load average for the past 15 minutes.
- `:percent`, `:percent5`, `:percent15`: CPU usage % for the past minute.
- `:bar`, `:bar5`, `:bar15`: ASCII progress bar, CPU %.
- `:spark`, `:spark5`, `:spark15`: the utf-8 spark line graphic (past minute, past 5 minutes, past 15 minutes)
- `:color`, `:color5`, `:color15`: a color (red, yellow, green) representing the percentage used (adaptive based on the percentage; past minute, past 5 minutes, past 15 minutes)

Load percentages are calculated simply by dividing load average by the number of cpus.

## Colors in the format string:

tmux uses a custom format for specifying colors, which is different from the set of codes used in the terminal. For compatibility, tmux-cpu also uses the same format: #[attributes]

where attributes are a comma-separated list of 'fg=color' and 'bg=color', for example:

    #[fg=yellow,bold]Yellow bold#[default] Gray

Attributes may a comma-delimited list of one or more of: bright (or bold), dim, underscore, blink, reverse, hidden, or italics.

Color may be one of: black, red, green, yellow, blue, magenta,
cyan, white, default, colour0 to colour255. Newer tmux versions also support RGB strings such as #ffffff. See `man tmux` for more info.

tmux-cpu also converts these strings to the appropriate TTY color codes for the terminal.

## Integrating with tmux

Make sure you have enabled utf-8 in the status line, either via `set -g status-utf8 on` in `~/.tmux.conf` or by running tmux with the `-u` flag: `tmux -u`.

Add the following line to your ~/.tmux.conf file:

    set -g status-right "#(/usr/local/bin/tmux-cpu)"

reload the tmux config by running tmux source-file ~/.tmux.conf.

