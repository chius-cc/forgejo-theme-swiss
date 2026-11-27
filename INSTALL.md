# Installing Forgejo Theme Swiss

This theme package provides three stylesheets for [Forgejo](https://forgejo.org/) (`17.x`):

| File | Theme ID in `app.ini` | Description |
| --- | --- | --- |
| `theme-swiss-auto.css` | `swiss-auto` | Automatically follows OS `prefers-color-scheme` (requires both light & dark CSS files alongside it) |
| `theme-swiss-light.css` | `swiss-light` | Standalone Warm Paper light theme |
| `theme-swiss-dark.css` | `swiss-dark` | Standalone Slate Night dark theme |

## 1. Binary / Systemd Installation

Place the three CSS files inside Forgejo's `custom/public/assets/css/` directory (check your `APP_DATA_PATH` / `CUSTOM_PATH`, commonly `/var/lib/forgejo/custom/` or `/etc/forgejo/`):

```sh
sudo mkdir -p /var/lib/forgejo/custom/public/assets/css
cd /var/lib/forgejo/custom/public/assets/css

sudo curl -fsSLO https://raw.githubusercontent.com/chius-n/forgejo-theme-swiss/main/theme-swiss-auto.css
sudo curl -fsSLO https://raw.githubusercontent.com/chius-n/forgejo-theme-swiss/main/theme-swiss-light.css
sudo curl -fsSLO https://raw.githubusercontent.com/chius-n/forgejo-theme-swiss/main/theme-swiss-dark.css
sudo chown -R forgejo:forgejo /var/lib/forgejo/custom/public/assets/css
```

Or clone the repository directly and copy/link `theme-swiss-*.css` into `custom/public/assets/css/`.

## 2. Docker / Compose Installation

Mount or copy `theme-swiss-auto.css`, `theme-swiss-light.css`, and `theme-swiss-dark.css` into `/data/gitea/public/assets/css/` inside the Forgejo container:

```yaml
services:
  forgejo:
    image: codeberg.org/forgejo/forgejo:17
    volumes:
      - ./forgejo-data:/data
      - ./forgejo-theme-swiss/theme-swiss-auto.css:/data/gitea/public/assets/css/theme-swiss-auto.css:ro
      - ./forgejo-theme-swiss/theme-swiss-light.css:/data/gitea/public/assets/css/theme-swiss-light.css:ro
      - ./forgejo-theme-swiss/theme-swiss-dark.css:/data/gitea/public/assets/css/theme-swiss-dark.css:ro
```

## 3. Configure `app.ini`

Add the theme identifiers (note that Forgejo strips the `theme-` prefix and `.css` suffix) to the `[ui]` section of `app.ini` ([Forgejo config reference](https://forgejo.org/docs/next/admin/config-cheat-sheet/#ui-ui)):

```ini
[ui]
DEFAULT_THEME = swiss-auto
THEMES = forgejo-auto,forgejo-light,forgejo-dark,swiss-auto,swiss-light,swiss-dark
```

Restart Forgejo to pick up the updated `app.ini` theme list:

```sh
sudo systemctl restart forgejo
```

Users can also switch individually between `swiss-auto`, `swiss-light`, and `swiss-dark` in **User Settings → Appearance**.
